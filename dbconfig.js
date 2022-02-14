// const driver = require('mssql/msnodesqlv8');

const sqlConfig = {
    user: process.env.DB_USER || 'yudha1404_Test',
    password: process.env.DB_PWD || '123456',
    database: process.env.DB_NAME || 'yudha1404_Test',
    server: 'sql.bsite.net\MSSQL2016',
    // driver: driver,
    pool: {
        max: 10,
        min: 0,
        idleTimeoutMillis: 30000
    },
    options: {
        encrypt: false, // for azure
        trustServerCertificate: false // change to true for local dev / self-signed certs
    }
}

module.exports = sqlConfig;