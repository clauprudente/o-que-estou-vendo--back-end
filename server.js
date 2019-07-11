const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const servidor = express();

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

servidor.get('/usuarios', async (request, response) => {
    usuariosController.getAll()
        .then(usuarios => response.send(usuarios))
})

servidor.post('/usuario', async (request, response) => {
    usuariosController.add(request.body)
        .then(usuario => {
            const _id = usuario._id;
            response.send(_id);
        })
        .catch(error => {
            if (error.name === "ValidationError") {
                response.sendStatus(400)
            }
            else {
                response.sendStatus(500)
            }
        })
})

servidor.listen(PORT);
console.info(`Rodando na porta ${PORT}`);
