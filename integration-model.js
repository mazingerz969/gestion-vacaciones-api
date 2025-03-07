// services/integration.service.js
/**
 * Servicio de Integración
 *
 * Este servicio maneja la integración con sistemas externos de la empresa,
 * incluyendo el sistema de RRHH, autenticación, y otros sistemas relevantes.
 */

const axios = require('axios');
const mongoose = require('mongoose');
const Usuario = require('../models/Usuario.model');
const Departamento = require('../models/Departamento.model');
const AsignacionVacaciones = require('../models/AsignacionVacaciones.model');
const CalendarioLaboral = require('../models/CalendarioLaboral.model');
const { generateJWT } = require('../utils/auth');
const logger = require('../utils/logger');

// Configuración
const config = {
  hrSystemApi: process.env.HR_SYSTEM_API,
  authSystemApi: process.env.AUTH_SYSTEM_API,
  apiKey: process.env.INTEGRATION_API_KEY,
  refreshInterval: parseInt(process.env.SYNC_INTERVAL_MINUTES) || 60 // minutos
};

/**
 * Sincroniza usuarios y departamentos desde el sistema de RRHH
 */
async function syncUsersAndDepartments() {
  try {
    logger.info('Iniciando sincronización de usuarios y departamentos');

    // 1. Obtener datos del sistema de RRHH
    const hrResponse = await axios.get(`${config.hrSystemApi}/employees`, {
      headers: {
        'x-api-key': config.apiKey
      }
    });

    const deptResponse = await axios.get(`${config.hrSystemApi}/departments`, {
      headers: {
        'x-api-key': config.apiKey
      }
    });

    // 2. Procesar departamentos
    const departamentos = deptResponse.data.departments;
    for (const dept of departamentos) {
      await Departamento.findOneAndUpdate(
        { codigo_externo: dept.code },
        {
          nombre: dept.name,
          descripcion: dept.description,
          codigo_externo: dept.code
        },
        { upsert: true, new: true }
      );
    }

    // Obtener mapa de departamentos para referencias
    const deptsMap = {};
    const allDepts = await Departamento.find({});
    allDepts.forEach(dept => {
      deptsMap[dept.codigo_externo] = dept._id;
    });

    // 3. Procesar usuarios
    const usuarios = hrResponse.data.employees;
    for (const user of usuarios) {
      // Verificar si el departamento existe
      const deptId = deptsMap[user.department_code];
      if (!deptId) {
        logger.warn(`Departamento no encontrado para el usuario ${user.email}: ${user.department_code}`);
        continue;
      }

      // Encontrar supervisor si existe
      let supervisorId = null;
      if (user.manager_email) {
        const supervisor = await Usuario.findOne({ email: user.manager_email });
        if (supervisor) {
          supervisorId = supervisor._id;
        }
      }

      // Actualizar o crear usuario
      await Usuario.findOneAndUpdate(
        { email: user.email },
        {
          nombre: user.first_name,
          apellido: user.last_name,
          email: user.email,
          departamento_id: deptId,
          rol: mapExternalRole(user.role),
          supervisor_id: supervisorId,
          activo: user.status === 'active',
          codigo_externo: user.employee_id
        },
        { upsert: true, new: true }
      );
    }

    logger.info('Sincronización de usuarios y departamentos completada');
  } catch (error) {
    logger.error('Error en sincronización de usuarios y departamentos', error);
    throw error;
  }
}

/**
 * Sincroniza información de vacaciones desde el sistema de RRHH
 */
async function syncVacationEntitlements() {
  try {
    logger.info('Iniciando sincronización de asignaciones de vacaciones');

    const currentYear = new Date().getFullYear();

    // Obtener datos del sistema de RRHH
    const response = await axios.get(`${config.hrSystemApi}/vacation-entitlements`, {
      params: { year: currentYear },
      headers: {
        'x-api-key': config.apiKey
      }
    });

    // Procesar asignaciones
    const asignaciones = response.data.entitlements;
    for (const asignacion of asignaciones) {
      // Buscar usuario por código externo
      const usuario = await Usuario.findOne({ codigo_externo: asignacion.employee_id });
      if (!usuario) {
        logger.warn(`Usuario no encontrado para asignación de vacaciones: ${asignacion.employee_id}`);
        continue;
      }

      // Actualizar o crear asignación
      await AsignacionVacaciones.findOneAndUpdate(
        {
          usuario_id: usuario._id,
          anio: currentYear
        },
        {
          usuario_id: usuario._id,
          anio: currentYear,
          dias_totales: asignacion.total_days,
          dias_base: asignacion.base_days,
          dias_antiguedad: asignacion.seniority_days,
          dias_extra: asignacion.extra_days,
          comentario: asignacion.comments || ''
        },
        { upsert: true, new: true }
      );
    }

    logger.info('Sincronización de asignaciones de vacaciones completada');
  } catch (error) {
    logger.error('Error en sincronización de asignaciones de vacaciones', error);
    throw error;
  }
}

/**
 * Sincroniza el calendario laboral con días festivos
 */
async function syncHolidays() {
  try {
    logger.info('Iniciando sincronización del calendario laboral');

    const currentYear = new Date().getFullYear();

    // Obtener datos del sistema de RRHH
    const response = await axios.get(`${config.hrSystemApi}/holidays`, {
      params: { year: currentYear },
      headers: {
        'x-api-key': config.apiKey
      }
    });

    // Procesar calendario laboral
    const calendarios = response.data.calendars;
    for (const cal of calendarios) {
      // Convertir fechas
      const diasFestivos = cal.holiday_dates.map(date => new Date(date));

      // Actualizar o crear calendario
      await CalendarioLaboral.findOneAndUpdate(
        {
          nombre: cal.name,
          anio: currentYear
        },
        {
          nombre: cal.name,
          anio: currentYear,
          dias_festivos: diasFestivos,
          codigo_externo: cal.calendar_id,
          descripcion: cal.description || ''
        },
        { upsert: true, new: true }
      );
    }

    logger.info('Sincronización del calendario laboral completada');
  } catch (error) {
    logger.error('Error en sincronización del calendario laboral', error);
    throw error;
  }
}

/**
 * Autentica un usuario con el sistema de autenticación existente
 */
async function authenticateUser(email, password) {
  try {
    // Llamar al sistema de autenticación externo
    const response = await axios.post(`${config.authSystemApi}/authenticate`, {
      email,
      password
    });

    // Verificar respuesta
    if (response.data.authenticated) {
      // Buscar usuario en la base de datos
      const usuario = await Usuario.findOne({ email });
      if (!usuario) {
        throw new Error('Usuario no encontrado en el sistema. Contacte a soporte.');
      }

      if (!usuario.activo) {
        throw new Error('Usuario inactivo. Contacte a RRHH.');
      }

      // Generar token JWT
      const token = generateJWT(usuario._id);

      // Obtener información adicional para el usuario
      const asignacion = await AsignacionVacaciones.findOne({
        usuario_id: usuario._id,
        anio: new Date().getFullYear()
      });

      // Construir respuesta
      return {
        token,
        user: {
          id: usuario._id,
          nombre: usuario.nombre,
          apellido: usuario.apellido,
          email: usuario.email,
          rol: usuario.rol,
          departamento_id: usuario.departamento_id,
          diasTotales: asignacion ? asignacion.dias_totales : 0
        }
      };
    } else {
      throw new Error('Credenciales inválidas');
    }
  } catch (error) {
    logger.error('Error de autenticación', error);

    // Si es error del sistema de autenticación
    if (error.response && error.response.data) {
      throw new Error(error.response.data.message || 'Error de autenticación');
    }

    throw error;
  }
}

/**
 * Mapea roles del sistema externo a roles de la aplicación
 */
function mapExternalRole(externalRole) {
  const roleMap = {
    employee: 'empleado',
    manager: 'manager',
    hr_staff: 'rrhh',
    admin: 'admin',
    director: 'manager'
  };

  return roleMap[externalRole.toLowerCase()] || 'empleado';
}

/**
 * Inicia tarea programada para sincronización periódica
 */
function startSyncScheduler() {
  logger.info(`Iniciando sincronización programada cada ${config.refreshInterval} minutos`);

  // Realizar sincronización inicial
  syncAll().catch(error => {
    logger.error('Error en sincronización inicial', error);
  });

  // Configurar sincronización periódica
  setInterval(() => {
    syncAll().catch(error => {
      logger.error('Error en sincronización programada', error);
    });
  }, config.refreshInterval * 60 * 1000);
}

/**
 * Ejecuta todas las sincronizaciones
 */
async function syncAll() {
  try {
    await syncUsersAndDepartments();
    await syncVacationEntitlements();
    await syncHolidays();
    logger.info('Sincronización completa finalizada con éxito');
  } catch (error) {
    logger.error('Error en sincronización completa', error);
    throw error;
  }
}

// Exportar funciones
module.exports = {
  syncUsersAndDepartments,
  syncVacationEntitlements,
  syncHolidays,
  authenticateUser,
  startSyncScheduler,
  syncAll
};
