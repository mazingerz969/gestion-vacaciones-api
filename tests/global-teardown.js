const mongoose = require('mongoose');

module.exports = async () => {
  // Desconectar mongoose
  await mongoose.disconnect();

  // Detener servidor MongoDB en memoria
  const mongoServer = global.__MONGO_SERVER__;
  if (mongoServer) {
    await mongoServer.stop();
  }
}; 