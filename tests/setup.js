// Configuración global para pruebas
require('dotenv').config({ path: '.env.test' });

// Configuraciones adicionales de pruebas
global.console = {
  log: jest.fn(),
  warn: jest.fn(),
  error: jest.fn()
};

// Configuración de timeout global para pruebas
jest.setTimeout(10000);
