// 🔥 Mock automático del modelo Brand
jest.mock("../db/brand");

const Brand = require("../db/brand");

const {
    getBrands,
    addBrand,
    updateBrand,
    deleteBrand,
    getBrand
} = require("../controllers/brand-controller");

// Helper para simular documentos mongoose
const mockDoc = (data) => ({
    ...data,
    toObject: () => data
});

beforeEach(() => {
    jest.clearAllMocks();
});

describe("Brand Controller", () => {

    // ---------------------------------------------------------
    // getBrands
    // ---------------------------------------------------------
    test("getBrands debe devolver todas las marcas", async() => {
        Brand.find.mockResolvedValue([
            mockDoc({ id: 1, name: "Yamaha" }),
            mockDoc({ id: 2, name: "Honda" })
        ]);

        const result = await getBrands();

        expect(Brand.find).toHaveBeenCalled();
        expect(result).toEqual([
            { id: 1, name: "Yamaha" },
            { id: 2, name: "Honda" }
        ]);
    });

    // ---------------------------------------------------------
    // getBrand
    // ---------------------------------------------------------
    test("getBrand debe devolver una marca por ID", async() => {
        Brand.findById.mockResolvedValue(
            mockDoc({ id: 123, name: "Suzuki" })
        );

        const result = await getBrand(123);

        expect(Brand.findById).toHaveBeenCalledWith(123);
        expect(result).toEqual({ id: 123, name: "Suzuki" });
    });

    // ---------------------------------------------------------
    // addBrand
    // ---------------------------------------------------------
    test("addBrand debe crear una nueva marca", async() => {
        const model = { name: "Kawasaki" };

        // Simular constructor de Mongoose
        Brand.mockImplementation(() => ({
            save: jest.fn(),
            toObject: () => ({ name: "Kawasaki" })
        }));

        const result = await addBrand(model);

        expect(result).toEqual({ name: "Kawasaki" });
    });

    // ---------------------------------------------------------
    // updateBrand
    // ---------------------------------------------------------
    test("updateBrand debe llamar a findByIdAndUpdate", async() => {
        Brand.findByIdAndUpdate.mockResolvedValue();

        await updateBrand("500", { name: "NuevaMarca" });

        expect(Brand.findByIdAndUpdate).toHaveBeenCalledWith(
            "500", { name: "NuevaMarca" }
        );
    });

    // ---------------------------------------------------------
    // deleteBrand
    // ---------------------------------------------------------
    test("deleteBrand debe llamar a findByIdAndDelete", async() => {
        Brand.findByIdAndDelete.mockResolvedValue();

        await deleteBrand("700");

        expect(Brand.findByIdAndDelete).toHaveBeenCalledWith("700");
    });

});