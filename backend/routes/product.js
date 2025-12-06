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

// RUTAS BÁSICAS DEL PRODUCTO
router.post("/", async(req, res) => {
    let model = req.body;
    let product = await addProduct(model);
    res.send(product);
});

router.put("/:id", async(req, res) => {
    let model = req.body;
    let id = req.params["id"];
    await updateProduct(id, model);
    res.send({ message: "Actualizado" });
});

router.delete("/:id", async(req, res) => {
    let id = req.params["id"];
    await deleteProduct(id);
    res.send({ message: "Eliminado" });
});

router.get("/:id", async(req, res) => {
    let id = req.params["id"];
    let product = await getProduct(id);
    res.send(product);
});

router.get("/", async(req, res) => {
    let products = await getAllProducts();
    res.send(products);
});

// NUEVAS RUTAS PARA COMPATIBILIDAD

// Buscar productos por compatibilidad principal
// Actualizar compatibilidad principal
router.put("/:id/compatibilidad/principal", async(req, res) => {
    try {
        let id = req.params["id"];
        let { marca, modelo, año } = req.body;
        let product = await updateMainCompatibility(id, marca, modelo, año);
        res.send(product);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

// ========================================
// RUTAS PARA EL SELECTOR DINÁMICO (fuera del PUT)
// ========================================

// Obtener todas las marcas
router.get("/selector/marcas", async(req, res) => {
    try {
        let marcas = await getAllBrandsFromProducts();
        res.send(marcas);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

// Obtener modelos según marca
router.get("/selector/modelos", async(req, res) => {
    try {
        const { marca } = req.query;
        let modelos = await getModelsByBrand(marca);
        res.send(modelos);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

// Obtener años según marca + modelo
router.get("/selector/year", async(req, res) => {
    try {
        const { marca, modelo } = req.query;
        let year = await getYearsByBrandAndModel(marca, modelo);
        res.send(year);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});


module.exports = router;