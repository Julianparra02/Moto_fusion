const express = require("express");
const { getNewProducts, getFeaturedProducts, getProductForListing, getProduct } = require("../controllers/product-controller");
const { getCategories } = require("../controllers/category-controller");

const { getCartItems, addToCart, removefromCart, clearCart } = require("./../controllers/cart-controller");
const { getBrands } = require("../controllers/brand-controller");
const { verifyToken } = require("../middleware/auth-middleware");
const router = express.Router();

const { addOrder, getCustomerOrders } = require("../controllers/order-controller");

router.get("/new-products", async(req, res) => {
    const products = await getNewProducts();
    res.send(products)
});
router.get("/featured-products", async(req, res) => {
    const products = await getFeaturedProducts();
    res.send(products)
});
router.get("/categories", async(req, res) => {
    const categories = await getCategories();
    res.send(categories)
});

router.get("/brands", async(req, res) => {
    const brands = await getBrands();
    res.send(brands)
});

router.get("/products", async(req, res) => {
    console.log("🔹 req.query:", req.query);
    const { searchTerm, categoryId, page, pageSize, brandId, marca, modelo, year } = req.query;
    const products = await getProductForListing(searchTerm, categoryId, page, pageSize, brandId, marca, modelo, year);
    res.send(products)
});

// Obtener un solo producto por ID (detalle)
router.get("/products/:id", async(req, res) => {
    try {
        const id = req.params.id;
        const product = await getProduct(id);

        if (!product) {
            return res.status(404).send({ message: "Producto no encontrado" });
        }

        res.send(product);
    } catch (err) {
        console.error("Error al obtener producto:", err);
        res.status(500).send({ message: "Error al obtener producto" });
    }
});

router.get("/carts", verifyToken, async(req, res) => {
    const userId = req.user.id;
    const items = await getCartItems(userId);
    res.send(items);
});

router.post("/carts/:id", verifyToken, async(req, res) => {
    const userId = req.user.id;
    const productId = req.params.id;
    const quantity = req.body.quantity;
    const items = await addToCart(userId, productId, quantity);
    res.send(items);
});

router.delete("/carts/:id", verifyToken, async(req, res) => {
    const userId = req.user.id;
    const productId = req.params.id;
    const items = await removefromCart(userId, productId);
    res.send(items);
});

router.post("/order", verifyToken, async(req, res) => {
    const userId = req.user.id;
    const order = req.body;
    await addOrder(userId, order);
    await clearCart(userId);
    return res.send({ message: "Pedido realizado con éxito" });
});

router.get("/orders", verifyToken, async(req, res) => {
    const userId = req.user.id;
    const orders = await getCustomerOrders(userId);
    return res.send(orders);
});


module.exports = router;