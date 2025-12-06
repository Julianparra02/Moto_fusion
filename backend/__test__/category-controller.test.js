jest.mock("../db/category"); // 🟢 Mock automático del modelo Category

const Category = require("../db/category");
const {
    addCategory,
    updateCategory,
    deleteCategory,
    getCategories,
    getCategoryById,
} = require("../controllers/category-controller");

// Helper para simular documentos con toObject()
const mockDoc = (data) => ({
    ...data,
    toObject: () => data
});

beforeEach(() => {
    jest.clearAllMocks();
});

describe("Category Controller", () => {

    // ---------------------------------------------------------
    // addCategory
    // ---------------------------------------------------------
    test("addCategory debe crear una nueva categoría", async() => {
        const model = { name: "Motos" };

        Category.mockImplementation(() => ({
            save: jest.fn(),
            toObject: () => ({ name: "Motos" })
        }));

        const result = await addCategory(model);

        expect(result).toEqual({ name: "Motos" });
    });

    // ---------------------------------------------------------
    // getCategories
    // ---------------------------------------------------------
    test("getCategories debe devolver todas las categorías", async() => {

        Category.find.mockResolvedValue([
            mockDoc({ id: 1, name: "A" }),
            mockDoc({ id: 2, name: "B" })
        ]);

        const result = await getCategories();

        expect(Category.find).toHaveBeenCalled();
        expect(result).toEqual([
            { id: 1, name: "A" },
            { id: 2, name: "B" }
        ]);
    });

    // ---------------------------------------------------------
    // getCategoryById
    // ---------------------------------------------------------
    test("getCategoryById debe devolver una categoría por ID", async() => {

        Category.findById.mockResolvedValue(
            mockDoc({ id: 10, name: "Aceites" })
        );

        const result = await getCategoryById("10");

        expect(Category.findById).toHaveBeenCalledWith("10");
        expect(result).toEqual({ id: 10, name: "Aceites" });
    });

    // ---------------------------------------------------------
    // updateCategory
    // ---------------------------------------------------------
    test("updateCategory debe llamar a findOneAndUpdate", async() => {

        Category.findOneAndUpdate.mockResolvedValue();

        await updateCategory("123", { name: "Nuevo nombre" });

        expect(Category.findOneAndUpdate).toHaveBeenCalledWith({ _id: "123" }, { name: "Nuevo nombre" });
    });

    // ---------------------------------------------------------
    // deleteCategory
    // ---------------------------------------------------------
    test("deleteCategory debe llamar a findByIdAndDelete", async() => {

        Category.findByIdAndDelete.mockResolvedValue();

        await deleteCategory("200");

        expect(Category.findByIdAndDelete).toHaveBeenCalledWith("200");
    });

});