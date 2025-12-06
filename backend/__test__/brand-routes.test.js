const request = require("supertest");
const express = require("express");

// 🟢 Mock del brand-controller
jest.mock("../controllers/brand-controller", () => ({
    addBrand: jest.fn().mockResolvedValue({ id: 1, name: "NuevaMarca" }),
    updateBrand: jest.fn().mockResolvedValue(),
    deleteBrand: jest.fn().mockResolvedValue(),
    getBrand: jest.fn().mockResolvedValue({ id: 10, name: "BrandX" }),
    getBrands: jest.fn().mockResolvedValue([{ id: 1, name: "A" }, { id: 2, name: "B" }]),
}));

// 🟢 Importar router DESPUÉS del mock
const brandRouter = require("../routes/brand");

const app = express();
app.use(express.json());
app.use("/brand", brandRouter);

describe("Rutas de Brand", () => {

    test("POST /brand crea una marca", async() => {
        const res = await request(app)
            .post("/brand")
            .send({ name: "NuevaMarca" });

        expect(res.status).toBe(200);
        expect(res.body).toEqual({ id: 1, name: "NuevaMarca" });
    });

    test("PUT /brand/:id actualiza marca", async() => {
        const res = await request(app)
            .put("/brand/123")
            .send({ name: "MarcaActualizada" });

        expect(res.status).toBe(200);
        expect(res.body).toEqual({ message: "actualizado" });
    });

    test("DELETE /brand/:id elimina marca", async() => {
        const res = await request(app).delete("/brand/10");

        expect(res.status).toBe(200);
        expect(res.body).toEqual({ message: "Eliminado" });
    });

    test("GET /brand/:id obtiene una marca", async() => {
        const res = await request(app).get("/brand/10");

        expect(res.status).toBe(200);
        expect(res.body).toEqual({ id: 10, name: "BrandX" });
    });

    test("GET /brand obtiene todas las marcas", async() => {
        const res = await request(app).get("/brand");

        expect(res.status).toBe(200);
        expect(res.body).toEqual([
            { id: 1, name: "A" },
            { id: 2, name: "B" }
        ]);
    });

});