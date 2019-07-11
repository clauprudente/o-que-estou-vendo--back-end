const { connect } = require('./repository');
const { usuariosModel } = require('./usuariosSchema');
const { livrosModel } = require('./livrosSchema')

connect();

const getAll = () => {
    return usuariosModel.find((error, usuarios) => {
        return usuarios
    });
}

module.exports = {
    getAll
}