const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const app = express();

// Puerto Railway o 3000
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());

// Rutas API
const categoryRoutes = require("./routes/category");
const brandRoutes = require("./routes/brand");
const orderRoutes = require("./routes/order");
const productRoutes = require("./routes/product");
const customerRoutes = require("./routes/customer");
const authRoutes = require("./routes/auth");
const { verifyToken, isAdmin } = require("./middleware/auth-middleware");

// === RUTAS ADMIN (PROTEGIDAS) ===
app.use("/category", verifyToken, isAdmin, categoryRoutes);
app.use("/brand", verifyToken, isAdmin, brandRoutes);
app.use("/orders", verifyToken, isAdmin, orderRoutes);

// === RUTAS PÚBLICAS ===
app.use("/product", productRoutes); // <-- ESTA DEBE SER PUBLICA
app.use("/customer", customerRoutes);
app.use("/auth", authRoutes);

// -------------------------------------------
// SERVIR ANGULAR DESDE /public
// -------------------------------------------
app.use(express.static(path.join(__dirname, "public")));

app.get(/.*/, (req, res) => {
    res.sendFile(path.join(__dirname, "public/index.html"));
});

// -------------------------------------------
// CONEXIÓN A MONGO ATLAS
// -------------------------------------------
async function connectDb() {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            dbName: "Moto_fusion-db",
        });
        console.log("🔥 Conectado a MongoDB Atlas");
    } catch (err) {
        console.error("❌ Error al conectar Mongo:", err.message);
    }
}

connectDb();

// -------------------------------------------
// LEVANTAR SERVIDOR
// -------------------------------------------
app.listen(PORT, () => {
    console.log(`🚀 Servidor ejecutándose en puerto ${PORT}`);
});