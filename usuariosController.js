const { connect } = require('./repository');
const usuariosModel = require('./usuariosSchema');
const { filmesModel } = require('./filmesSchema');
require('dotenv-safe').load()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

connect();


const getAll = () => {
    return usuariosModel.find((error, usuarios) => {
        return usuarios
    });
}

const add = async(usuario) => {
    const usuarioEncontrado = await usuariosModel.findOne({ email: usuario.email })

    if (usuarioEncontrado) {
        throw new Error('Email já cadastrado')
    }
    const salt = bcrypt.genSaltSync(10);
    const senhaCriptografada = bcrypt.hashSync(usuario.senha, salt);
    usuario.senha = senhaCriptografada;

    const novoUsuario = new usuariosModel(usuario);
    return novoUsuario.save();
}

const remove = (id) => {
    return usuariosModel.findByIdAndDelete(id)
}

const update = (id, usuario) => {
    return usuariosModel.findByIdAndUpdate(
        id, { $set: usuario }, { new: true },
    )
}


const getById = (id) => {
    return usuariosModel.findById(id);
}

const getAllFilmes = async(usuarioId) => {
    const usuario = await getById(usuarioId)
    if (usuario) {
        return usuario.filmes;
    }
}

const addFilmes = async(usuarioId, filmes) => {
    const usuario = await getById(usuarioId);
    const novoFilme = new filmesModel(filmes);

    usuario.filmes.push(novoFilme);
    return usuario.save()
}

const login = async(dadosDoLogin) => {
    const usuarioEncontrado = await usuariosModel.findOne({ email: dadosDoLogin.email })
    if (usuarioEncontrado) {
        const senhaCorreta = bcrypt.compareSync(
            dadosDoLogin.senha, usuarioEncontrado.senha
        )
        if (senhaCorreta) {
            const token = jwt.sign({
                    id: usuarioEncontrado._id
                },
                process.env.PRIVATE_KEY
            )
            return { auth: true, token };
        } else {
            throw new Error('Senha incorreta, prestenção parça')
        }
    } else {
        throw new Error('Email não está cadastrado')
    }
}

const logout = () => {
    return { auth: false, token: null }
}


module.exports = {
    getAll,
    add,
    getAllFilmes,
    addFilmes,
    login,
    getById,
    update,
    remove,
    logout
}