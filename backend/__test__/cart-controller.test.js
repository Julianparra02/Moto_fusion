const Cart = require("../db/cart");
const Product = require("../db/product");

const {
    addToCart,
    removefromCart,
    getCartItems,
    clearCart,
} = require("../controllers/cart-controller");

// MOCKS de Mongoose
jest.mock("../db/cart");
jest.mock("../db/product");

describe("Cart Controller Tests", () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    // ------------------------------------------------------
    // TEST addToCart - crea nuevo item cuando NO existe antes
    // ------------------------------------------------------
    test("addToCart crea un nuevo producto si no existe", async() => {
        Cart.findOne.mockResolvedValue(null);

        Cart.prototype.save = jest.fn().mockResolvedValue(true);

        await addToCart("user123", "prod999", 2);

        expect(Cart.findOne).toHaveBeenCalledWith({
            userId: "user123",
            productId: "prod999",
        });

        expect(Cart.prototype.save).toHaveBeenCalled();
    });

    // ------------------------------------------------------
    // TEST addToCart - incrementa cantidad si el producto YA existe
    // ------------------------------------------------------
    test("addToCart incrementa la cantidad si el producto ya existe", async() => {
        Cart.findOne.mockResolvedValue({
            _id: "cartItem123",
            quantity: 2,
        });

        Cart.findByIdAndUpdate.mockResolvedValue(true);

        await addToCart("user123", "prod999", 3);

        expect(Cart.findByIdAndUpdate).toHaveBeenCalledWith("cartItem123", {
            quantity: 5,
        });
    });

    // ------------------------------------------------------
    // TEST removeFromCart
    // ------------------------------------------------------
    test("removefromCart elimina un item por userId y productId", async() => {
        Cart.findOneAndDelete.mockResolvedValue(true);

        await removefromCart("user123", "prod999");

        expect(Cart.findOneAndDelete).toHaveBeenCalledWith({
            userId: "user123",
            productId: "prod999",
        });
    });

    // ------------------------------------------------------
    // TEST getCartItems
    // ------------------------------------------------------
    test("getCartItems retorna los productos con populate", async() => {
        Cart.find.mockReturnValue({
            populate: jest.fn().mockResolvedValue([
                { productId: { name: "Producto X" }, quantity: 3 },
            ]),
        });

        const items = await getCartItems("user123");

        expect(items).toEqual([{
            product: { name: "Producto X" },
            quantity: 3,
        }, ]);
    });

    // ------------------------------------------------------
    // TEST clearCart
    // ------------------------------------------------------
    test("clearCart elimina todos los productos del usuario", async() => {
        Cart.deleteMany.mockResolvedValue(true);

        await clearCart("user123");

        expect(Cart.deleteMany).toHaveBeenCalledWith({ userId: "user123" });
    });


});