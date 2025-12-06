const request = require("supertest");
const express = require("express");

// MOCK DE CONTROLADORES (DEBE COINCIDIR CON LO QUE IMPORTA EL ROUTER)
jest.mock("../controllers/product-controller", () => ({
    addProduct: jest.fn().mockResolvedValue({ id: 1, name: "Test Product" }),
    updateProduct: jest.fn().mockResolvedValue(true),
    deleteProduct: jest.fn().mockResolvedValue(true),
    getProduct: jest.fn().mockResolvedValue({ id: 1, name: "Product 1" }),
    getAllProducts: jest.fn().mockResolvedValue([{ id: 1 }, { id: 2 }]),
    updateMainCompatibility: jest.fn().mockResolvedValue({ ok: true }),

    // Estos fueron usados en el selector:
    getAllBrandsFromProducts: jest.fn().mockResolvedValue(["Yamaha", "Honda"]),
    getModelsByBrand: jest.fn().mockResolvedValue(["R1", "R6"]),
    getYearsByBrandAndModel: jest.fn().mockResolvedValue([2020, 2021])
}));

// MOCK DE MIDDLEWARES
jest.mock("../middleware/auth-middleware", () => ({
    verifyToken: (req, res, next) => next(),
    isAdmin: (req, res, next) => next()
}));

// IMPORTAR EL ROUTER REAL
const productRouter = require("../routes/product");

const app = express();
app.use(express.json());
app.use("/product", productRouter);

describe("Rutas de Producto", () => {

    test("POST /product crea producto", async() => {
        const res = await request(app).post("/product").send({ name: "Test Product" });
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({ id: 1, name: "Test Product" });
    });

    test("GET /product devuelve todos los productos", async() => {
        const res = await request(app).get("/product");
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual([{ id: 1 }, { id: 2 }]);
    });

    test("GET /product/:id devuelve un producto", async() => {
        const res = await request(app).get("/product/1");
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({ id: 1, name: "Product 1" });
    });

    test("PUT /product/:id actualiza producto", async() => {
        const res = await request(app).put("/product/1").send({ name: "Updated" });
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({ message: "Actualizado" });
    });

    test("DELETE /product/:id elimina producto", async() => {
        const res = await request(app).delete("/product/1");
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({ message: "Eliminado" });
    });

    test("PUT /product/:id/compatibilidad/principal actualiza compatibilidad principal", async() => {
        const res = await request(app)
            .put("/product/1/compatibilidad/principal")
            .send({ marca: "Yamaha", modelo: "R1", año: 2020 });

        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({ ok: true });
    });

    test("GET /product/selector/marcas devuelve marcas", async() => {
        const res = await request(app).get("/product/selector/marcas");
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual(["Yamaha", "Honda"]);
    });

    test("GET /product/selector/modelos devuelve modelos", async() => {
        const res = await request(app).get("/product/selector/modelos?marca=Yamaha");
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual(["R1", "R6"]);
    });

    test("GET /product/selector/year devuelve años", async() => {
        const res = await request(app).get("/product/selector/year?marca=Yamaha&modelo=R1");
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual([2020, 2021]);
    });

});