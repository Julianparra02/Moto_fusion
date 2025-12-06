const mongoose = require("mongoose");
const { Schema } = mongoose;

const productSchema = new Schema({
    // INFORMACIÓN BÁSICA DEL PRODUCTO
    id: String,
    name: { type: String, required: true },
    description: String,
    reference: String,
    price: Number,
    categoryId: {
        type: Schema.Types.ObjectId,
        ref: "categories",
    },
    brandId: {
        type: Schema.Types.ObjectId,
        ref: "brands",
    },
    isFeatured: Boolean,
    isNewProduct: Boolean,
    images: [String],

    // INFORMACIÓN DE COMPATIBILIDAD
    marca: String, // Ej: "Honda"
    modelo: String, // Ej: "CB500"
    year: Number, // Ej: 2018

    // NUEVO: COMPATIBILIDAD CON VARIAS MOTOS
    compatibilidad: [{
        marca: String,
        modelo: String,
        year: Number,
    }, ],
});

module.exports = mongoose.model("Product", productSchema);