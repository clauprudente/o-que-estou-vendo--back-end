const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const usuariosSchema = new Schema({
    _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
    email: { type: String, required: true },
    senha: { type: String, required: true }
});

const usuariosModel = mongoose.model("usuarios", usuariosSchema);

module.exports = { usuariosSchema, usuariosModel };