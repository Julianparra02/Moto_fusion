const request = require("supertest");
const express = require("express");

// 🟢 MOCK DE CONTROLADORES EXACTOS
jest.mock("../controllers/category-controller", () => ({
    addCategory: jest.fn().mockResolvedValue({ id: 1, name: "Nueva Categoría" }),
    updateCategory: jest.fn().mockResolvedValue(true),
    deleteCategory: jest.fn().mockResolvedValue(true),
    getCategories: jest.fn().mockResolvedValue([
        { id: 1, name: "Cat1" },
        { id: 2, name: "Cat2" }
    ]),
    getCategoryById: jest.fn().mockResolvedValue({ id: 1, name: "Cat1" })
}));

// 🟢 IMPORTAR EL ROUTER DESPUÉS DE MOCKEAR
const categoryRouter = require("../routes/category");

// 🟢 CONFIGURAR EXPRESS PARA PRUEBAS
const app = express();
app.use(express.json());
app.use("/category", categoryRouter);

describe("Rutas de Categorías", () => {

    test("POST /category debe crear una categoría", async() => {
        const res = await request(app)
            .post("/category")
            .send({ name: "Nueva Categoría" });

        expect(res.status).toBe(200);
        expect(res.body).toEqual({ id: 1, name: "Nueva Categoría" });
    });

    test("GET /category debe devolver todas las categorías", async() => {
        const res = await request(app).get("/category");

        expect(res.status).toBe(200);
        expect(res.body).toEqual([
            { id: 1, name: "Cat1" },
            { id: 2, name: "Cat2" }
        ]);
    });

    test("GET /category/:id debe devolver categoría específica", async() => {
        const res = await request(app).get("/category/1");

        expect(res.status).toBe(200);
        expect(res.body).toEqual({ id: 1, name: "Cat1" });
    });

    test("PUT /category/:id debe actualizar una categoría", async() => {
        const res = await request(app)
            .put("/category/1")
            .send({ name: "Actualizada" });

        expect(res.status).toBe(200);
        expect(res.body).toEqual({ message: "actualizado" });
    });

    test("DELETE /category/:id debe eliminar una categoría", async() => {
        const res = await request(app).delete("/category/1");

        expect(res.status).toBe(200);
        expect(res.body).toEqual({ message: "eliminado  " });
    });

});