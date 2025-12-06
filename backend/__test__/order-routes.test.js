const request = require("supertest");
const express = require("express");

// 🟢 Mock de funciones del controlador exactamente como se importan:
jest.mock("../controllers/order-controller", () => ({
    getOrders: jest.fn().mockResolvedValue([
        { id: 1, status: "pendiente" },
        { id: 2, status: "enviado" }
    ]),

    updateOrderStatus: jest.fn().mockResolvedValue(true)
}));

// 🟢 Importar router DESPUÉS de mockear
const orderRouter = require("../routes/order");

// 🟢 Crear app de pruebas
const app = express();
app.use(express.json());
app.use("/orders", orderRouter);

describe("Rutas de Órdenes", () => {

    test("GET /orders debe devolver lista de órdenes", async() => {
        const res = await request(app).get("/orders");

        expect(res.status).toBe(200);
        expect(res.body).toEqual([
            { id: 1, status: "pendiente" },
            { id: 2, status: "enviado" }
        ]);
    });

    test("POST /orders/:id debe actualizar estado de orden", async() => {
        const res = await request(app)
            .post("/orders/1")
            .send({ status: "completado" });

        expect(res.status).toBe(200);
        expect(res.body).toEqual({ message: "Actualizar" });
    });

});