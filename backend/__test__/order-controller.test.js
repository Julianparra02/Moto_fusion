jest.mock("../db/order", () => ({
    find: jest.fn(),
    findByIdAndUpdate: jest.fn(),
}));

const Order = require("../db/order");
const { getOrders, updateOrderStatus } = require("../controllers/order-controller");

describe("order-controller", () => {

    test("getOrders devuelve lista de órdenes", async() => {
        Order.find.mockResolvedValue([
            { toObject: () => ({ id: 1 }) },
            { toObject: () => ({ id: 2 }) },
        ]);

        const result = await getOrders();

        expect(result).toEqual([{ id: 1 }, { id: 2 }]);
    });

    test("updateOrderStatus actualiza correctamente", async() => {
        Order.findByIdAndUpdate.mockResolvedValue({});

        await updateOrderStatus("123", "Enviado");

        expect(Order.findByIdAndUpdate).toHaveBeenCalledWith(
            "123", { status: "Enviado" }
        );
    });

});