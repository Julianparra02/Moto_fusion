const mongoose = require("mongoose");

// 🟢 Importamos el modelo
const User = require("../db/user"); // Ajusta la ruta si tu archivo no está en db/

describe("Modelo User", () => {

    test("El modelo debe estar definido", () => {
        expect(User).toBeDefined();
    });

    test("Debe tener el nombre del modelo correcto", () => {
        expect(User.modelName).toBe("users");
    });

    test("Debe tener los campos del schema definidos", () => {
        const schema = User.schema.paths;

        expect(schema.name).toBeDefined();
        expect(schema.email).toBeDefined();
        expect(schema.password).toBeDefined();
        expect(schema.isAdmin).toBeDefined();
    });

    test("Debe crear una instancia de usuario correctamente", () => {
        const user = new User({
            name: "Juan",
            email: "test@test.com",
            password: "123456",
            isAdmin: false
        });

        expect(user.name).toBe("Juan");
        expect(user.email).toBe("test@test.com");
        expect(user.password).toBe("123456");
        expect(user.isAdmin).toBe(false);
    });

});