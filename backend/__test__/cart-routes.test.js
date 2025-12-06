const request = require("supertest");
const express = require("express");

// 🟢 Mock del controlador del carrito
jest.mock("../controllers/cart-controller", () => ({
    getCart: jest.fn().mockImplementation((req, res) =>
        res.send([{ id: 1, qty: 2 }])
    ),
    addToCart: jest.fn().mockImplementation((req, res) =>
        res.send({ added: true })
    ),
    updateCartItem: jest.fn().mockImplementation((req, res) =>
        res.send({ updated: true })
    ),
    removeCartItem: jest.fn().mockImplementation((req, res) =>
        res.send({ removed: true })
    ),
    clearCart: jest.fn().mockImplementation((req, res) =>
        res.send({ cleared: true })
    ),
}));

// 🟢 Mock del middleware EXACTO que requiere el router
jest.mock("../middleware/auth-middleware.js", () => {
    return (req, res, next) => {
        req.user = { id: "test-user" }; // Simular usuario autenticado
        next();
    };
});

// 🟢 Importar router DESPUÉS de mockear auth
const cartRouter = require("../routes/cart");

// Crear app express para pruebas
const app = express();
app.use(express.json());
app.use("/cart", cartRouter);

describe("Rutas del carrito", () => {

    test("GET /cart devuelve el carrito del usuario", async() => {
        const res = await request(app).get("/cart");
        expect(res.status).toBe(200);
        expect(res.body).toEqual([{ id: 1, qty: 2 }]);
    });

    test("POST /cart/add agrega un producto", async() => {
        const res = await request(app)
            .post("/cart/add")
            .send({ productId: "P1", qty: 1 });

        expect(res.status).toBe(200);
        expect(res.body).toEqual({ added: true });
    });

    test("PUT /cart/item actualiza un producto", async() => {
        const res = await request(app)
            .put("/cart/item")
            .send({ productId: "P1", qty: 3 });

        expect(res.status).toBe(200);
        expect(res.body).toEqual({ updated: true });
    });

    test("DELETE /cart/item/:productId elimina un item", async() => {
        const res = await request(app).delete("/cart/item/P1");
        expect(res.status).toBe(200);
        expect(res.body).toEqual({ removed: true });
    });

    test("DELETE /cart vacía el carrito", async() => {
        const res = await request(app).delete("/cart");
        expect(res.status).toBe(200);
        expect(res.body).toEqual({ cleared: true });
    });

});