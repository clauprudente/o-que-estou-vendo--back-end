const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const servidor = express();
const usuariosController = require('./usuariosController')

const PORT = 3000;

const logger = (request, response, next) => {
    console.log(`${new Date().toISOString()} Request type: ${request.method} to ${request.originalUrl}`);

    response.on('finish', () => {
        console.log(`${response.statusCode} ${response.statusMessage};`);
    })

    next();
}

servidor.use(cors());
servidor.use(bodyParser.json());
servidor.use(logger);

servidor.get('/', (request, response) => {
    response.send('Servidor subiu \o/');
});

servidor.get('/usuarios', (request, response) => {
    usuariosController.getAll()
        .then(usuarios => response.send(usuarios))
})

servidor.post('/usuarios', (request, response) => {
    usuariosController.add(request.body)
        .then(usuario => {
            const _id = usuario._id;
            response.send(_id);
        })
        .catch(error => {
            if (error.name === "ValidationError") {
                response.sendStatus(400)
            } else {
                response.sendStatus(500)
            }
        })
})

servidor.get('/usuario/:usuarioId/filmes', (request, response) => {
    const usuarioId = request.params.usuarioId;
    usuariosController.getAllFilmes(usuarioId)
        .then(filmesUsuario => response.send(filmesUsuario));
})

servidor.post('/usuario/:usuarioId/adicionar-filme', (request, response) => {
    const usuarioId = request.params.usuarioId;
    usuariosController.addFilmes(usuarioId, request.body)
        .then(usuario => {
            const _id = usuario._id;
            response.send(_id);
        })
        .catch(erro => {
            if (erro.name === "ValidationError") {
                response.sendStatus(400);
            } else {
                console.log(erro);
                response.sendStatus(500);
            }
        })
})

servidor.post('/usuario/login', (request, response) => {
    usuariosController.login(request.body)
        .then(respostaDoLogin => {
            response.send(respostaDoLogin)
        })
        .catch(erro => {
            if (erro.name === "ValidationError") {
                console.log(erro);
                response.sendStatus(400);
            } else {
                console.log(erro);
                response.sendStatus(500)
            }
        })
})

servidor.listen(PORT);
console.info(`Rodando na porta ${PORT}`);