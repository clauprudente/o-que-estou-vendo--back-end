const { connect } = require('./repository');
const usuariosModel = require('./usuariosSchema');
const { livrosModel } = require('./livrosSchema');

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

const getById = (id) => {
    return usuariosModel.findById(id);
}

const getAllLivros = async (usuarioId) => {
    const usuario = await getById(usuarioId);
    return usuario.livros;
}

const addLivros = async (usuarioId, livros) => {
    const usuario = await getById(usuarioId);
    const novoLivro = new livrosModel(livros);

    usuario.livros.push(novoLivro);
    return usuario.save()
}

module.exports = {
    getAll,
    add,
    getAllLivros,
    addLivros
}