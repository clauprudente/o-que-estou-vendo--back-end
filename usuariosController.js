const { connect } = require('./repository');
const usuariosModel = require('./usuariosSchema');
const { filmesModel } = require('./filmesSchema');

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

const getAllFilmes = async(usuarioId) => {
    const usuario = await getById(usuarioId);
    return usuario.filmes;
}

const addFilmes = async(usuarioId, filmes) => {
    const usuario = await getById(usuarioId);
    const novoFilme = new filmesModel(filmes);

    usuario.filmes.push(novoFilme);
    return usuario.save()
}

const login = async(dadosDoLogin) => {
    const usuarioEncontrado = await filmesModel.findOne({ email: dadosDoLogin.email })

    if (usuarioEncontrado) {
        const senhaCorreta = bcrypt.compareSync(
            dadosDoLogin.senha, usuarioEncontrado.senha
        )

        if (senhaCorreta) {
            const token = jwt.sign({
                    email: usuarioEncontrado.email,
                    id: usuarioEncontrado._id
                },
                process.env.PRIVATE_KEY
            )
            return { auth: true, token };
        } else {
            throw new Error('Dados incorretos')
        }
    } else {
        throw new Error('Dados incorretos')
    }
}

module.exports = {
    getAll,
    add,
    getAllFilmes,
    addFilmes,
    login
}