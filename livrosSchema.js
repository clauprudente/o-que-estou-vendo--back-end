const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const livrosSchema = new Schema({
    _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
    nome: { type: String, required: true },
    foto: { type: String, required: true },
    sinopse: { type: String },
    dataLido: { type: String }
});

const livrosModel = mongoose.model("livros", livrosSchema)

module.exports = { livrosModel, livrosSchema };