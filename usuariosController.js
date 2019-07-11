const { connect } = require('./repository');
const { usuariosModel } = require('./usuariosSchema');
const { livrosModel } = require('./livrosSchema')

connect();

const getAll = () => {
    return usuariosModel.find((error, usuarios) => {
        return usuarios
    });
}

const add = (usuario) => {
    const novoUsuario = new usuariosModel(usuario);
    return novoUsuario.save();
}

module.exports = {
    getAll,
    add
}