const mongoose = require("mongoose");

// 🟢 Importar el modelo
const Brand = require("../db/brand"); // Ajusta la ruta según tu estructura

describe("Modelo Brand", () => {

    test("El modelo debe estar definido", () => {
        expect(Brand).toBeDefined();
    });

    test("Debe tener el nombre del modelo correcto", () => {
        expect(Brand.modelName).toBe("brands");
    });

    test("El schema debe tener el campo name definido", () => {
        const schema = Brand.schema.paths;

        expect(schema.name).toBeDefined();
        expect(schema.name.instance).toBe("String");
    });

    test("Debe crear una instancia correctamente", () => {
        const brand = new Brand({ name: "Honda" });

        expect(brand.name).toBe("Honda");
    });

});