const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const servidor = express();
const usuariosController = require('./usuariosController');
const params = require('params')
const parametrosPermitidos = require('./parametrosPermitidos')
const jwt = require('jsonwebtoken')

const PORT = process.env.PORT || 3000

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
        .then(usuario => {
            response.send(usuario)
        })
        .catch(error => {
            if (error.name === 'CastError') {
                response.sendStatus(400)
            } else {
                response.sendStatus(500)
            }
        })
})

servidor.get('/usuarios/:usuarioId', (request, response) => {
    const usuarioId = request.params.usuarioId
    usuariosController.getById(usuarioId)
        .then(usuario => {
            if (!usuario) {
                response.sendStatus(404)
            } else {
                response.send(usuario)
            }
        })
        .catch(error => {
            if (error.name === 'CastError') {
                response.sendStatus(400)
            } else {
                response.sendStatus(500)
            }
        })
})

servidor.patch('/usuarios/:id', (request, response) => {
    const id = request.params.id
    usuariosController.update(id, request.body)
        .then(usuarios => {
            if (!usuarios) { response.sendStatus(404) } else { response.send(usuarios) }
        })
        .catch(error => {
            if (error.name === "MongoError" || error.name === "CastError") {
                response.sendStatus(400)
            } else {
                response.sendStatus(500)
            }
        })
})

servidor.delete('/usuarios/:id', async(request, response) => {
    usuariosController.remove(request.params.id)
        .then(usuario => {
            if (usuario) {
                response.sendStatus(204)
            } else {
                response.sendStatus(404)
            }
        })

    .catch(error => {
        response.sendStatus(500);
    })

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

servidor.get('/usuario/filmes', (request, response) => {
    const authHeader = request.get('authorization')
    let auth = false

    if (authHeader) {
        const token = authHeader.split(' ')[1]
        jwt.verify(token, process.env.PRIVATE_KEY, function(error, decoded) {
            if (error) {
                response.sendStatus(403)
            } else {
                auth = true;
                request.userId = decoded.id
            }
        })
    } else {
        response.send(401)
    }

    if (auth) {
        const usuarioId = request.userId;
        usuariosController.getAllFilmes(usuarioId)
            .then(filmesUsuario => response.send(filmesUsuario));
    }
})

servidor.post('/usuario/adicionar-filme', (request, response) => {
    const authHeader = request.get('authorization')
    let auth = false

    if (authHeader) {
        const token = authHeader.split(' ')[1]
        jwt.verify(token, process.env.PRIVATE_KEY, function(error, decoded) {
            if (error) {
                response.sendStatus(403)
            } else {
                auth = true;
                request.userId = decoded.id
            }
        })
    } else {
        response.send(401)
    }

    if (auth) {
        const usuarioId = request.userId;
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
    }
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
            };
        });
});

servidor.get('/usuario/logout', (request, response) => {
    response.status(200).send(usuariosController.logout());
});

servidor.listen(PORT);
console.info(`Rodando na porta ${PORT}`);