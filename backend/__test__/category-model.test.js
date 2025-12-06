const mongoose = require("mongoose");

// 🟢 Importar el modelo
const Category = require("../db/category"); // Ajusta ruta si está en otro folder

describe("Modelo Category", () => {

    test("El modelo debe estar definido", () => {
        expect(Category).toBeDefined();
    });

    test("Debe tener el nombre del modelo correcto", () => {
        expect(Category.modelName).toBe("categories");
    });

    test("Debe tener el campo name definido", () => {
        const schema = Category.schema.paths;
        expect(schema.name).toBeDefined();
        expect(schema.name.instance).toBe("String");
    });

    test("Debe crear una instancia correctamente", () => {
        const cat = new Category({ name: "Motos" });

        expect(cat.name).toBe("Motos");
    });

});