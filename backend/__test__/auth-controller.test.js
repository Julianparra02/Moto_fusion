jest.mock("../db/user"); // Mock del modelo User
jest.mock("bcrypt"); // Mock bcrypt
jest.mock("jsonwebtoken"); // Mock JWT

const User = require("../db/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const { registerUser, loginUser } = require("../controllers/auth-controller");

// Helper para simular documentos mongoose
const mockUserDoc = (data) => ({
    ...data,
    save: jest.fn(),
});

describe("Auth Controller", () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    // -------------------------------------------------------------
    // registerUser
    // -------------------------------------------------------------
    test("registerUser debe hashear la contraseña y guardar el usuario", async() => {
        const model = { name: "John", email: "john@test.com", password: "1234" };

        bcrypt.hash.mockResolvedValue("hashedPassword");
        User.mockImplementation(() => mockUserDoc({...model, password: "hashedPassword" }));

        await registerUser(model);

        expect(bcrypt.hash).toHaveBeenCalledWith("1234", 10);
        expect(User).toHaveBeenCalledWith({
            name: "John",
            email: "john@test.com",
            password: "hashedPassword"
        });
    });

    // -------------------------------------------------------------
    // loginUser → usuario no encontrado
    // -------------------------------------------------------------
    test("loginUser retorna null si el usuario no existe", async() => {
        User.findOne.mockResolvedValue(null);

        const result = await loginUser({ email: "x@test.com", password: "1234" });

        expect(result).toBeNull();
    });

    // -------------------------------------------------------------
    // loginUser → contraseña incorrecta
    // -------------------------------------------------------------
    test("loginUser retorna null si la contraseña es incorrecta", async() => {
        const fakeUser = { password: "hashed123" };

        User.findOne.mockResolvedValue(fakeUser);
        bcrypt.compare.mockResolvedValue(false);

        const result = await loginUser({ email: "x@test.com", password: "wrong" });

        expect(bcrypt.compare).toHaveBeenCalled();
        expect(result).toBeNull();
    });

    // -------------------------------------------------------------
    // loginUser → login correcto
    // -------------------------------------------------------------
    test("loginUser retorna token y usuario si login es correcto", async() => {
        const fakeUser = {
            _id: "user123",
            name: "John",
            email: "john@test.com",
            password: "hashed123",
            isAdmin: false
        };

        User.findOne.mockResolvedValue(fakeUser);
        bcrypt.compare.mockResolvedValue(true);
        jwt.sign.mockReturnValue("mockedToken");

        const result = await loginUser({ email: "john@test.com", password: "1234" });

        expect(bcrypt.compare).toHaveBeenCalledWith("1234", "hashed123");
        expect(jwt.sign).toHaveBeenCalledWith({
                id: "user123",
                name: "John",
                email: "john@test.com",
                isAdmin: false
            },
            "secreto", { expiresIn: "1h" }
        );

        expect(result).toEqual({
            token: "mockedToken",
            user: fakeUser
        });
    });

});