const express = require('express')
const app = express();
const bodyParser = require('body-parser')
const connection = require('./database/database') // ? importando a conexão do banco para usar
const Pergunta = require('./database/Pergunta') // ? importa a conexão com a tabela perguntas
const Resposta = require('./database/Resposta') // ? importando o modulo de resposta

// ! Database
connection
    .authenticate() // ? tenta autenticar no banco
    .then(() => { // ? se a conexão ocorrer com sucesso
        console.log('Banco conectado!');
    })
    .catch(msgError => { // se der erro
        console.log(msgError);
    })

// ? Estou dizendo para o Express usar o EJS como View engine 
app.set('view engine', 'ejs')
app.use(express.static('public'))

// ? bodyParser
app.use(bodyParser.urlencoded({ extended: false })) // ? bodyParser vai traduzir esses dados em uma estrutura js, possiblitando o use no projeto
app.use(bodyParser.json()) // comando opcional, isso permite que leia dados de usuarios enviados via json

// ! rotas
app.get('/', (req, res) => {
    Pergunta.findAll({ raw: true, order: [
        ['id', 'DESC'] // ordenação: ASC = Crescente || DESC = Decrescente -- ornedando pelo id
    ]}).then(perguntas => { // ? metodo responsavel por procurar todos os registros e retornar. Equivalente a SELECT ALL FROM ...
        
        perguntas.map(resp => { // formatando a data
            const date = resp.createdAt
            const formatDate = date.toLocaleDateString()
            const hours = date.getHours()
            const minutes = date.getMinutes()
            resp.createdAt = `${formatDate} ás ${hours}:${minutes}`  
         })
       
        res.render("index", {
            perguntas: perguntas,
        })
    })
})

app.get('/perguntar', (req, res) => {
    res.render('perguntar')
})

app.post('/saveQuest', (req, res) => { // ? rota que receberá os dados do formulário
    const titulo = req.body.titulo // pegando o dado do campo titulo
    const descricao = req.body.descricao // pegando os dados do campo descricao

    Pergunta.create({ // ? cria um novo registro na tabela. O create faz o INSERT INTO ... do sql
        titulo: titulo, // passa os dados para o registro
        descricao: descricao
    }).then(() => {
        res.redirect('/') // redireciona pra home
    })
})

app.get('/pergunta/:id', (req, res) => {
    const id = req.params.id
    Pergunta.findOne({ // ? metodo para buscar somente um item
        where: {id: id} // ? busca a pergunta da qual o id é igual o id passado no parametro
    }).then(pergunta => { // se achar a pergunta ele vai retornar no then
        if(pergunta != undefined) { // pergunta achada

            Resposta.findAll({
                raw: true,
                where: {perguntaId: pergunta.id},
                order: [ 
                    ['id', 'DESC']
                ]
            }).then(respostas => {
               
                respostas.map(resp => {
                   const date = resp.createdAt
                   const formatDate = date.toLocaleDateString()
                   const hours = date.getHours()
                   const minutes = date.getMinutes()
                   resp.createdAt = `${formatDate} ás ${hours}:${minutes}`  
                })

                res.render('pergunta', {
                    pergunta: pergunta, // passa os dados da pergunta para o frontend
                    respostas: respostas // se achar respostas vai mandar para a view do frontend
                }) // exibe a página
                
            })

        } else { // não encontrada 
            res.redirect('/') // redireciona para a home
        }
    })
})

app.post('/responder', (req, res) => {
    const corpoRes = req.body.corpo
    const perguntaId = req.body.pergunta
    
    Resposta.create({
        corpo: corpoRes, // passando os dados campos para a tabela resposta
        perguntaId: perguntaId
    }).then(() => {
        res.redirect(`/pergunta/${perguntaId}`) // redireciona para a página da pergunta que foi respondida
    })
})

// ! inicialização do app
app.listen(8080, () => {
    console.log("App rodando na porta 8080...");
})