const express = require("express");
const { registerUser, loginUser } = require("../controllers/auth-controller");
const router = express.Router();

router.post("/register", async(req, res) => {
    let model = req.body;
    if (model.name && model.email && model.password) {
        await registerUser(model);
        res.send({
            message: "Usuario registrado",
        })
    } else {
        res.status(400).json({
            error: "por favor proporcione nombre, email o constraseña"

        })
    }
})

router.post("/login", async(req, res) => {
    let model = req.body;
    if (model.email && model.password) {
        const result = await loginUser(model);
        if (result) {
            res.send(result)
        } else {
            res.status(400).json({
                error: "Email o constraseña incorrecto"

            })
        }
    } else {
        res.status(400).json({
            error: "por favor proporcione email o constraseña"

        })
    }
})

module.exports = router;