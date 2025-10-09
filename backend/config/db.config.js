// backend/config/db.config.js

module.exports = {
  // Lit les variables du .env (qui sont maintenant dans process.env)
  HOST: process.env.DB_HOST,
  USER: process.env.DB_USER,
  PASSWORD: process.env.DB_PASSWORD,
  DB: process.env.DB_NAME,
  // Vous utilisez MariaDB (via phpMyAdmin), le dialecte est donc 'mysql'
  DIALECT: "mysql", 
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
};