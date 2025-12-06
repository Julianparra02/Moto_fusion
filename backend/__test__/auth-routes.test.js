const request = require("supertest");
const express = require("express");

// 🟢 Mock del controlador de autenticación
jest.mock("../controllers/auth-controller", () => ({
    registerUser: jest.fn().mockResolvedValue(true),
    loginUser: jest.fn().mockResolvedValue({ token: "abc123" }), // default: login exitoso
}));

const { registerUser, loginUser } = require("../controllers/auth-controller");

// 🟢 Importar router después del mock
const authRouter = require("../routes/auth");

const app = express();
app.use(express.json());
app.use("/auth", authRouter);

describe("Rutas de autenticación", () => {

    // -----------------------------------------------------
    // TEST REGISTER
    // -----------------------------------------------------
    test("POST /auth/register → registra un usuario correctamente", async() => {
        const res = await request(app)
            .post("/auth/register")
            .send({
                name: "Juan",
                email: "test@test.com",
                password: "123456"
            });

        expect(res.status).toBe(200);
        expect(res.body).toEqual({ message: "Usuario registrado" });
        expect(registerUser).toHaveBeenCalled();
    });

    test("POST /auth/register → retorna 400 si faltan campos", async() => {
        const res = await request(app)
            .post("/auth/register")
            .send({ email: "test@test.com" });

        expect(res.status).toBe(400);
        expect(res.body).toEqual({
            error: "por favor proporcione nombre, email o constraseña"
        });
    });

    // -----------------------------------------------------
    // TEST LOGIN
    // -----------------------------------------------------
    test("POST /auth/login → inicia sesión correctamente", async() => {
        loginUser.mockResolvedValueOnce({ token: "abc123" });

        const res = await request(app)
            .post("/auth/login")
            .send({ email: "test@test.com", password: "123456" });

        expect(res.status).toBe(200);
        expect(res.body).toEqual({ token: "abc123" });
    });

    test("POST /auth/login → retorna 400 si faltan campos", async() => {
        const res = await request(app)
            .post("/auth/login")
            .send({ email: "test@test.com" });

        expect(res.status).toBe(400);
        expect(res.body).toEqual({
            error: "por favor proporcione email o constraseña"
        });
    });

    test("POST /auth/login → retorna 400 si credenciales son incorrectas", async() => {
        loginUser.mockResolvedValueOnce(null); // fuerza login fallido

        const res = await request(app)
            .post("/auth/login")
            .send({ email: "wrong@test.com", password: "badpass" });

        expect(res.status).toBe(400);
        expect(res.body).toEqual({
            error: "Email o constraseña incorrecto"
        });
    });

});