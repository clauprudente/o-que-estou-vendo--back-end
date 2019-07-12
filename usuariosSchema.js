const mongoose = require("mongoose");
const { livrosSchema } = require('./livrosSchema');
const Schema = mongoose.Schema;

const usuariosSchema = new Schema({
    _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
    email: { type: String, required: true },
    senha: { type: String, required: true },
    livros: [livrosSchema]
});

const usuariosModel = mongoose.model("usuarios", usuariosSchema);

module.exports = usuariosModel;