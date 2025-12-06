const express = require("express");
const {
    addProduct,
    updateProduct,
    deleteProduct,
    getProduct,
    getAllProducts,
    getAllBrandsFromProducts,
    getModelsByBrand,
    getYearsByBrandAndModel,
    updateMainCompatibility
} = require("../controllers/product-controller");

const router = express.Router();

// ====================================================
// 🔹 RUTAS FIJAS (DEBEN IR ANTES DE /:id)
// ====================================================

// Obtener todas las marcas (selector dinámico)
router.get("/selector/marcas", async(req, res) => {
    try {
        const marcas = await getAllBrandsFromProducts();
        res.send(marcas);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

// Obtener modelos por marca
router.get("/selector/modelos", async(req, res) => {
    try {
        const { marca } = req.query;
        const modelos = await getModelsByBrand(marca);
        res.send(modelos);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

// Obtener años por marca y modelo
router.get("/selector/year", async(req, res) => {
    try {
        const { marca, modelo } = req.query;
        const years = await getYearsByBrandAndModel(marca, modelo);
        res.send(years);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

// Obtener todos los productos
router.get("/", async(req, res) => {
    try {
        const products = await getAllProducts();
        res.send(products);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

// Crear producto
router.post("/", async(req, res) => {
    try {
        const product = await addProduct(req.body);
        res.send(product);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

// Actualizar compatibilidad principal
router.put("/:id/compatibilidad/principal", async(req, res) => {
    try {
        const id = req.params.id;
        const { marca, modelo, año } = req.body;
        const product = await updateMainCompatibility(id, marca, modelo, año);
        res.send(product);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

// ====================================================
// 🔹 RUTAS DINÁMICAS (DEBEN IR AL FINAL SIEMPRE)
// ====================================================

// Obtener producto por ID
router.get("/:id", async(req, res) => {
    try {
        const product = await getProduct(req.params.id);
        res.send(product);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

// Actualizar producto
router.put("/:id", async(req, res) => {
    try {
        await updateProduct(req.params.id, req.body);
        res.send({ message: "Actualizado" });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

// Eliminar producto
router.delete("/:id", async(req, res) => {
    try {
        await deleteProduct(req.params.id);
        res.send({ message: "Eliminado" });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

module.exports = router;