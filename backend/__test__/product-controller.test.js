jest.mock("../db/product", () => ({
    find: jest.fn(),
    findById: jest.fn(),
    findByIdAndUpdate: jest.fn(),
}));

const Product = require("../db/product");
const {
    getProductsByMainCompatibility,
    getProductsByCompatibility,
    addCompatibility,
    removeCompatibility,
    updateMainCompatibility,
    getNewProducts,
    getFeaturedProducts,
    getProductForListing,
} = require("../controllers/product-controller");

describe("product-controller extra tests", () => {

    test("getProductsByMainCompatibility filtra correctamente", async() => {
        Product.find.mockResolvedValue([
            { toObject: () => ({ id: 1 }) }
        ]);

        const result = await getProductsByMainCompatibility("Yamaha", "R1", 2020);

        expect(Product.find).toHaveBeenCalledWith({
            marca: "Yamaha",
            modelo: "R1",
            year: 2020
        });

        expect(result).toEqual([{ id: 1 }]);
    });

    test("getProductsByCompatibility busca en $or correctamente", async() => {
        Product.find.mockResolvedValue([
            { toObject: () => ({ id: 2 }) }
        ]);

        const result = await getProductsByCompatibility("Honda", "CBR", 2021);

        expect(Product.find).toHaveBeenCalledWith({
            $or: [
                { marca: "Honda", modelo: "CBR", year: 2021 },
                { compatibilidad: { $elemMatch: { marca: "Honda", modelo: "CBR", year: 2021 } } }
            ]
        });

        expect(result).toEqual([{ id: 2 }]);
    });

    test("addCompatibility añade compatibilidad", async() => {
        const product = {
            compatibilidad: [],
            save: jest.fn(),
            toObject: () => ({ ok: true })
        };

        Product.findById.mockResolvedValue(product);

        const result = await addCompatibility("1", { marca: "Yamaha" });

        expect(product.compatibilidad).toContainEqual({ marca: "Yamaha" });
        expect(result).toEqual({ ok: true });
    });

    test("removeCompatibility elimina compatibilidad", async() => {
        const product = {
            compatibilidad: [{ a: 1 }, { b: 2 }],
            save: jest.fn(),
            toObject: () => ({ ok: true })
        };

        Product.findById.mockResolvedValue(product);

        await removeCompatibility("1", 0);

        expect(product.compatibilidad).toEqual([{ b: 2 }]);
    });

    test("updateMainCompatibility actualiza fields", async() => {
        Product.findByIdAndUpdate.mockResolvedValue({
            toObject: () => ({ updated: true })
        });

        const result = await updateMainCompatibility("1", "Yamaha", "R1", 2020);

        expect(result).toEqual({ updated: true });
    });

    test("getNewProducts obtiene productos nuevos", async() => {
        Product.find.mockResolvedValue([{ toObject: () => ({ id: 10 }) }]);

        const result = await getNewProducts();

        expect(Product.find).toHaveBeenCalledWith({ isNewProduct: true });
        expect(result).toEqual([{ id: 10 }]);
    });

    test("getFeaturedProducts obtiene productos destacados", async() => {
        Product.find.mockResolvedValue([{ toObject: () => ({ id: 20 }) }]);

        const result = await getFeaturedProducts();

        expect(Product.find).toHaveBeenCalledWith({ isFeatured: true });
        expect(result).toEqual([{ id: 20 }]);
    });

    test("getProductForListing construye filtro correctamente", async() => {

        Product.find.mockReturnValue({
            skip: () => ({
                limit: () => ([
                    { toObject: () => ({ id: 100 }) }
                ])
            })
        });

        const result = await getProductForListing("r1", "cat1", 1, 10, "brand1", "Yamaha", "R1", 2020);

        expect(Array.isArray(result)).toBe(true);
        expect(result[0]).toEqual({ id: 100 });
    });

});