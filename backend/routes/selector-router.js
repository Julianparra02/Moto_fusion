const express = require("express");
const {
    getAllCategories,
    getBrandsByCategory,
    getAllBrands,
    getMarcas,
    getModelsByMarca,
    getYearsByMarcaAndModel
} = require("../controllers/product-controller");

const router = express.Router();

// Obtener todas las categorías
router.get("/categories", async(req, res) => {
    try {
        const categories = await getAllCategories();
        res.send(categories);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

// Obtener marcas según categoría
router.get("/brands", async(req, res) => {
    try {
        const { categoryId } = req.query;
        const brands = categoryId ? await getBrandsByCategory(categoryId) : await getAllBrands();
        res.send(brands);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

// Obtener “Marca” (string) para compatibilidad
router.get("/marca", async(req, res) => {
    try {
        const marcas = await getMarcas();
        res.send(marcas);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

// Obtener modelos según marca
router.get("/modelo", async(req, res) => {
    try {
        const { marca } = req.query;
        const modelos = await getModelsByMarca(marca);
        res.send(modelos);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

// Obtener años según marca + modelo
router.get("/year", async(req, res) => {
    try {
        const { marca, modelo } = req.query;
        const years = await getYearsByMarcaAndModel(marca, modelo);
        res.send(years);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

module.exports = router;