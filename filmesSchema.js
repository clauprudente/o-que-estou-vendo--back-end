const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const filmesSchema = new Schema({
    _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
    nome: { type: String, required: true },
    imagem: { type: String, required: true },
    estrelas: { type: Number, required: true }
});

const filmesModel = mongoose.model("filmes", filmesSchema)

module.exports = { filmesModel, filmesSchema };