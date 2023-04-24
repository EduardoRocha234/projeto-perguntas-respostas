const Sequelize = require('sequelize')
const connection = require('./database') // estabelecendo a conexão

const Pergunta = connection.define('perguntas', { // faz a conexão com a tabela 
    titulo: {   // define o campo titulo
        type: Sequelize.STRING, // define o tipo STRING -> textos de comprimento menor
        allowNull: false // não permite que esse campo seja nullo
    },
    descricao: { // define o campo descricao
        type: Sequelize.TEXT, // define o tipo TEXT -> textos de comprimento maior
        allowNull: false 
    }
})

// o sync sincroniza os dados com a tabela mo banco
Pergunta.sync({force: false}) // 'force: false' cria a tabela somente uma única vez
    .then(() => {}) /// retorna quando a tabela é criada

module.exports = Pergunta; // exporta