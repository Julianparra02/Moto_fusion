const express = require("express");
const router = express.Router();
const {
    getCart,
    addToCart,
    updateCartItem,
    removeCartItem,
    clearCart,
} = require("../controllers/cart-controller");

// ⚠️ Asumo que ya tienes un middleware de auth que rellena req.user
const auth = require("../middleware/auth-middleware.js");

// Carrito del usuario logueado
router.get("/", auth, getCart);

// Agregar producto
router.post("/add", auth, addToCart);

// Actualizar cantidad
router.put("/item", auth, updateCartItem);

// Eliminar producto concreto
router.delete("/item/:productId", auth, removeCartItem);

// Vaciar carrito
router.delete("/", auth, clearCart);

module.exports = router;