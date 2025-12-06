const request = require("supertest");
const express = require("express");

// 🟢 Mock de TODOS los controladores usados por este router
jest.mock("../controllers/product-controller", () => ({
    getNewProducts: jest.fn().mockResolvedValue([{ id: 1 }]),
    getFeaturedProducts: jest.fn().mockResolvedValue([{ id: 2 }]),
    getProductForListing: jest.fn().mockResolvedValue([{ id: 3 }]),
    getProduct: jest.fn().mockResolvedValue({ id: 4 }),
}));

jest.mock("../controllers/category-controller", () => ({
    getCategories: jest.fn().mockResolvedValue(["Cat1", "Cat2"]),
}));

jest.mock("../controllers/brand-controller", () => ({
    getBrands: jest.fn().mockResolvedValue(["Brand1", "Brand2"]),
}));

jest.mock("../controllers/cart-controller", () => ({
    getCartItems: jest.fn().mockResolvedValue([{ id: 10 }]),
    addToCart: jest.fn().mockResolvedValue([{ id: 11 }]),
    removefromCart: jest.fn().mockResolvedValue([{ id: 12 }]),
    clearCart: jest.fn().mockResolvedValue(true),
}));

jest.mock("../controllers/order-controller", () => ({
    addOrder: jest.fn().mockResolvedValue(true),
    getCustomerOrders: jest.fn().mockResolvedValue([{ id: 20 }]),
}));

// 🟢 mock del middleware -> para que req.user exista
const fakeAuth = (req, res, next) => {
    req.user = { id: "test-user" };
    next();
};

// 🟢 IMPORTA EL ROUTER CORRECTO (ajusta este nombre según tu archivo real)
const customerRouter = require("../routes/customer");

const app = express();
app.use(express.json());
app.use(fakeAuth);
app.use("/", customerRouter);

describe("Rutas del Cliente", () => {

    test("GET /new-products", async() => {
        const res = await request(app).get("/new-products");
        expect(res.status).toBe(200);
        expect(res.body).toEqual([{ id: 1 }]);
    });

    test("GET /featured-products", async() => {
        const res = await request(app).get("/featured-products");
        expect(res.status).toBe(200);
        expect(res.body).toEqual([{ id: 2 }]);
    });

    test("GET /categories", async() => {
        const res = await request(app).get("/categories");
        expect(res.status).toBe(200);
        expect(res.body).toEqual(["Cat1", "Cat2"]);
    });

    test("GET /brands", async() => {
        const res = await request(app).get("/brands");
        expect(res.status).toBe(200);
        expect(res.body).toEqual(["Brand1", "Brand2"]);
    });

    test("GET /products", async() => {
        const res = await request(app).get("/products?searchTerm=test");
        expect(res.status).toBe(200);
        expect(res.body).toEqual([{ id: 3 }]);
    });

    test("GET /products/:id", async() => {
        const res = await request(app).get("/products/4");
        expect(res.status).toBe(200);
        expect(res.body).toEqual({ id: 4 });
    });

    test("GET /carts", async() => {
        const res = await request(app).get("/carts");
        expect(res.status).toBe(200);
        expect(res.body).toEqual([{ id: 10 }]);
    });

    test("POST /carts/:id", async() => {
        const res = await request(app).post("/carts/50").send({ quantity: 2 });
        expect(res.status).toBe(200);
        expect(res.body).toEqual([{ id: 11 }]);
    });

    test("DELETE /carts/:id", async() => {
        const res = await request(app).delete("/carts/50");
        expect(res.status).toBe(200);
        expect(res.body).toEqual([{ id: 12 }]);
    });

    test("POST /order", async() => {
        const res = await request(app).post("/order").send({ items: [] });
        expect(res.status).toBe(200);
        expect(res.body).toEqual({ message: "Pedido realizado con éxito" });
    });

    test("GET /orders", async() => {
        const res = await request(app).get("/orders");
        expect(res.status).toBe(200);
        expect(res.body).toEqual([{ id: 20 }]);
    });

});