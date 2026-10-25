module.exports = {
    dialect: 'postgres',
    host: 'localhost',
    port: '5432',
    username: 'admin',
    password: 'postgres1', 
    database: 'devburguer-postgres',
    define: {
        timestamps: true,
        underscored: true,
        underscoredAll: true,
    }
}