const mongoose = require('mongoose');
const Usuario = require('../../src/models/Usuario');

describe('Modelo de Usuario', () => {
  beforeEach(async () => {
    await Usuario.deleteMany({});
  });

  test('Crear usuario válido', async () => {
    const usuarioData = {
      nombre: 'Juan',
      apellido: 'Pérez',
      email: 'juan.perez@ejemplo.com',
      password: 'contraseña123',
      rol: 'empleado'
    };

    const usuario = new Usuario(usuarioData);
    const usuarioGuardado = await usuario.save();

    expect(usuarioGuardado.nombre).toBe(usuarioData.nombre);
    expect(usuarioGuardado.email).toBe(usuarioData.email);
    expect(usuarioGuardado.rol).toBe(usuarioData.rol);
  });

  test('No crear usuario sin email', async () => {
    const usuarioData = {
      nombre: 'Juan',
      apellido: 'Pérez',
      password: 'contraseña123',
      rol: 'empleado'
    };

    const usuario = new Usuario(usuarioData);

    await expect(usuario.save()).rejects.toThrow();
  });

  test('No crear usuario con email inválido', async () => {
    const usuarioData = {
      nombre: 'Juan',
      apellido: 'Pérez',
      email: 'correo-invalido',
      password: 'contraseña123',
      rol: 'empleado'
    };

    const usuario = new Usuario(usuarioData);

    await expect(usuario.save()).rejects.toThrow();
  });

  test('Hashear contraseña antes de guardar', async () => {
    const usuarioData = {
      nombre: 'Juan',
      apellido: 'Pérez',
      email: 'juan.perez@ejemplo.com',
      password: 'contraseña123',
      rol: 'empleado'
    };

    const usuario = new Usuario(usuarioData);
    const usuarioGuardado = await usuario.save();

    // La contraseña guardada debe ser diferente a la original
    expect(usuarioGuardado.password).not.toBe(usuarioData.password);
  });

  test('Comparar contraseña correcta', async () => {
    const usuarioData = {
      nombre: 'Juan',
      apellido: 'Pérez',
      email: 'juan.perez@ejemplo.com',
      password: 'contraseña123',
      rol: 'empleado'
    };

    const usuario = new Usuario(usuarioData);
    const usuarioGuardado = await usuario.save();

    const esPasswordCorrecta = await usuarioGuardado.compararPassword('contraseña123');
    expect(esPasswordCorrecta).toBe(true);
  });

  test('Comparar contraseña incorrecta', async () => {
    const usuarioData = {
      nombre: 'Juan',
      apellido: 'Pérez',
      email: 'juan.perez@ejemplo.com',
      password: 'contraseña123',
      rol: 'empleado'
    };

    const usuario = new Usuario(usuarioData);
    const usuarioGuardado = await usuario.save();

    const esPasswordCorrecta = await usuarioGuardado.compararPassword('contraseñaincorrecta');
    expect(esPasswordCorrecta).toBe(false);
  });

  test('Virtual nombreCompleto', async () => {
    const usuarioData = {
      nombre: 'Juan',
      apellido: 'Pérez',
      email: 'juan.perez@ejemplo.com',
      password: 'contraseña123',
      rol: 'empleado'
    };

    const usuario = new Usuario(usuarioData);
    const usuarioGuardado = await usuario.save();

    expect(usuarioGuardado.nombreCompleto).toBe('Juan Pérez');
  });
}); 