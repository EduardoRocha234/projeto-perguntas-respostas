const Sequelize = require('sequelize')
const connection = require('./database') // estabelecendo a conexão

const Resposta = connection.define("respostas", {
    corpo: {
        type: Sequelize.TEXT, // corpo da pergunta
        allowNull: false
    },
    perguntaId: {
        type: Sequelize.INTEGER, // tipo integer, id da pergunta da qual a vai ser feita a resposta
        allowNull: false
    }
})

Resposta.sync({ force: false})

module.exports = Resposta