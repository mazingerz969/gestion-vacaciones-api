const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../../src/index');
const Usuario = require('../../src/models/Usuario');

describe('Controlador de Usuarios', () => {
  let token;
  let usuarioId;

  beforeAll(async () => {
    // Limpiar base de datos
    await Usuario.deleteMany({});
  });

  test('Registro de usuario', async () => {
    const res = await request(app)
      .post('/api/usuarios/registro')
      .send({
        nombre: 'Test',
        apellido: 'Usuario',
        email: 'test@ejemplo.com',
        password: 'contraseña123',
        rol: 'empleado'
      });

    expect(res.statusCode).toEqual(201);
    expect(res.body.success).toBe(true);
    expect(res.body.token).toBeTruthy();
    expect(res.body.usuario.email).toBe('test@ejemplo.com');

    usuarioId = res.body.usuario.id;
  });

  test('Login de usuario', async () => {
    const res = await request(app)
      .post('/api/usuarios/login')
      .send({
        email: 'test@ejemplo.com',
        password: 'contraseña123'
      });

    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toBe(true);
    expect(res.body.token).toBeTruthy();

    token = res.body.token;
  });

  test('Obtener perfil de usuario', async () => {
    const res = await request(app)
      .get('/api/usuarios/perfil')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toBe(true);
    expect(res.body.usuario.email).toBe('test@ejemplo.com');
  });

  test('Actualizar perfil de usuario', async () => {
    const res = await request(app)
      .put('/api/usuarios/perfil')
      .set('Authorization', `Bearer ${token}`)
      .send({
        nombre: 'Nuevo Nombre',
        apellido: 'Nuevo Apellido'
      });

    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toBe(true);
    expect(res.body.usuario.nombre).toBe('Nuevo Nombre');
  });

  test('Cambiar contraseña', async () => {
    const res = await request(app)
      .put('/api/usuarios/cambiar-password')
      .set('Authorization', `Bearer ${token}`)
      .send({
        passwordActual: 'contraseña123',
        nuevaPassword: 'nuevacontraseña456'
      });

    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toBe(true);
    expect(res.body.token).toBeTruthy();
  });

  test('Login con nueva contraseña', async () => {
    const res = await request(app)
      .post('/api/usuarios/login')
      .send({
        email: 'test@ejemplo.com',
        password: 'nuevacontraseña456'
      });

    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toBe(true);
    expect(res.body.token).toBeTruthy();
  });

  test('Registro de usuario duplicado', async () => {
    const res = await request(app)
      .post('/api/usuarios/registro')
      .send({
        nombre: 'Test',
        apellido: 'Usuario',
        email: 'test@ejemplo.com',
        password: 'contraseña123',
        rol: 'empleado'
      });

    expect(res.statusCode).toEqual(400);
    expect(res.body.success).toBe(false);
  });

  test('Login con credenciales incorrectas', async () => {
    const res = await request(app)
      .post('/api/usuarios/login')
      .send({
        email: 'test@ejemplo.com',
        password: 'contraseñaincorrecta'
      });

    expect(res.statusCode).toEqual(401);
    expect(res.body.success).toBe(false);
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });
}); 