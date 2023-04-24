const Sequelize = require('sequelize'); // importando oo sequelize

// ciando a instancia para fazer a conexão
// 1° parametro --> nome do bando de dados
// 2° parametro --> usuário (geralmente é o root)
// 3° parametro --> senha do usuario
// 4° parametro --> objeto contendo host(onde está rodando o banco), dialect (qual o o tipo do banco de dados)
const connection = new Sequelize('guiaperguntas', 'root', '123dev', {
    host: 'localhost',
    dialect: 'mysql'
})

module.exports = connection // exportando o objeto de conexão