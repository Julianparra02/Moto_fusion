const mongoose = require("mongoose");

// 🟢 Importar modelo
const Cart = require("../db/cart"); // Ajusta la ruta si el archivo está en otro lugar

describe("Modelo Cart", () => {

    test("El modelo debe estar definido", () => {
        expect(Cart).toBeDefined();
    });

    test("Debe tener el nombre del modelo correcto", () => {
        expect(Cart.modelName).toBe("carts");
    });

    test("El schema debe tener los campos correctos", () => {
        const schema = Cart.schema.paths;

        expect(schema.userId).toBeDefined();
        expect(schema.productId).toBeDefined();
        expect(schema.quantity).toBeDefined();

        // Tipos
        expect(schema.userId.instance).toBe("ObjectId");
        expect(schema.productId.instance).toBe("ObjectId");
        expect(schema.quantity.instance).toBe("Number");
    });

    test("Debe crear una instancia correctamente", () => {
        const cartItem = new Cart({
            userId: new mongoose.Types.ObjectId(),
            productId: new mongoose.Types.ObjectId(),
            quantity: 3
        });

        expect(cartItem.quantity).toBe(3);
        expect(cartItem.userId).toBeDefined();
        expect(cartItem.productId).toBeDefined();
    });

});