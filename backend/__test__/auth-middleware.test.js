const { verifyToken, isAdmin } = require("../middleware/auth-middleware");
const jwt = require("jsonwebtoken");

jest.mock("jsonwebtoken");

describe("Middleware: verifyToken", () => {

    test("Debe retornar 401 si no hay token", () => {
        const req = { header: jest.fn().mockReturnValue(null) };
        const res = { status: jest.fn().mockReturnThis(), send: jest.fn() };
        const next = jest.fn();

        verifyToken(req, res, next);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.send).toHaveBeenCalledWith({ error: "Acceso Denegado" });
        expect(next).not.toHaveBeenCalled();
    });

    test("Debe retornar 401 si el token es invalido", () => {
        const req = { header: jest.fn().mockReturnValue("TOKEN") };
        const res = { status: jest.fn().mockReturnThis(), send: jest.fn() };
        const next = jest.fn();

        jwt.verify.mockImplementation(() => { throw new Error("Invalid"); });

        verifyToken(req, res, next);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.send).toHaveBeenCalledWith({ error: "Token invalido" });
    });

    test("Debe ejecutar next() si el token es válido", () => {
        const req = { header: jest.fn().mockReturnValue("TOKEN") };
        const res = {};
        const next = jest.fn();

        const user = { id: "123", name: "John" };
        jwt.verify.mockReturnValue(user);

        verifyToken(req, res, next);

        expect(req.user).toEqual(user);
        expect(next).toHaveBeenCalled();
    });

});

describe("Middleware: isAdmin", () => {

    test("Debe permitir acceso si es admin", () => {
        const req = { user: { isAdmin: true } };
        const res = {};
        const next = jest.fn();

        isAdmin(req, res, next);

        expect(next).toHaveBeenCalled();
    });

    test("Debe retornar 403 si NO es admin", () => {
        const req = { user: { isAdmin: false } };
        const res = { status: jest.fn().mockReturnThis(), send: jest.fn() };
        const next = jest.fn();

        isAdmin(req, res, next);

        expect(res.status).toHaveBeenCalledWith(403);
        expect(res.send).toHaveBeenCalledWith({ error: "Prohibido" });
        expect(next).not.toHaveBeenCalled();
    });
});