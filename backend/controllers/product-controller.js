const Product = require("./../db/product");

async function addProduct(model) {
    let product = new Product({
        ...model
    })
    await product.save();
    return product.toObject();
}

async function updateProduct(id, model) {
    await Product.findByIdAndUpdate(id, model);
}

async function deleteProduct(id) {
    await Product.findByIdAndDelete(id);
}

async function getAllProducts() {
    let products = await Product.find();
    return products.map((x) => x.toObject());
}

async function getProduct(id) {
    let product = await Product.findById(id);
    return product.toObject();
}

// NUEVAS FUNCIONES PARA COMPATIBILIDAD

// Buscar productos por compatibilidad principal
async function getProductsByMainCompatibility(marca, modelo, year) {
    let products = await Product.find({
        marca: marca,
        modelo: modelo,
        year: year
    });
    return products.map((x) => x.toObject());
}

// Buscar productos por compatibilidad extendida
async function getProductsByCompatibility(marca, modelo, year) {
    let products = await Product.find({
        $or: [
            // Buscar en compatibilidad principal
            { marca: marca, modelo: modelo, year: year },
            // Buscar en la lista de compatibilidad
            {
                "compatibilidad": {
                    $elemMatch: {
                        marca: marca,
                        modelo: modelo,
                        year: year
                    }
                }
            }
        ]
    });
    return products.map((x) => x.toObject());
}

// Añadir nueva compatibilidad a un producto
async function addCompatibility(productId, compatibilityData) {
    let product = await Product.findById(productId);
    if (!product) {
        throw new Error("Producto no encontrado");
    }

    product.compatibilidad.push(compatibilityData);
    await product.save();
    return product.toObject();
}

// Eliminar una compatibilidad específica
async function removeCompatibility(productId, compatibilityIndex) {
    let product = await Product.findById(productId);
    if (!product) {
        throw new Error("Producto no encontrado");
    }

    product.compatibilidad.splice(compatibilityIndex, 1);
    await product.save();
    return product.toObject();
}

// Actualizar la compatibilidad principal
async function updateMainCompatibility(productId, marca, modelo, year) {
    let product = await Product.findByIdAndUpdate(
        productId, {
            $set: {
                marca: marca,
                modelo: modelo,
                year: year
            }
        }, { new: true }
    );
    return product.toObject();
}

async function getNewProducts() {
    let newProducts = await Product.find({
        isNewProduct: true
    });
    return newProducts.map(x => x.toObject());
}

async function getFeaturedProducts() {
    let featuredProducts = await Product.find({
        isFeatured: true
    });
    return featuredProducts.map(x => x.toObject());
}


async function getProductForListing(
    searchTerm,
    categoryId,
    page,
    pageSize,
    brandId,
    marca,
    modelo,
    year
) {
    page = Number(page) || 1;
    pageSize = Number(pageSize) || 10;

    let filter = {};

    if (searchTerm) {
        filter.name = { $regex: searchTerm, $options: "i" };
    }

    if (categoryId) filter.categoryId = categoryId;
    if (brandId) filter.brandId = brandId;

    const orConditions = [];

    // --- NORMALIZACIÓN ---
    if (typeof marca === "string") marca = marca.trim();
    if (typeof modelo === "string") modelo = modelo.trim();

    if (marca || modelo || year) {
        const mainCompat = {};
        const listCompat = {};

        if (marca) {
            const marcaRegex = new RegExp(marca.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
            mainCompat.marca = marcaRegex;
            listCompat.marca = marcaRegex;
        }

        if (modelo) {
            const modeloRegex = new RegExp(modelo.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
            mainCompat.modelo = modeloRegex;
            listCompat.modelo = modeloRegex;
        }

        if (year) {
            const y = Number(year);
            mainCompat.year = y;
            listCompat.year = y;
        }

        if (Object.keys(mainCompat).length) orConditions.push(mainCompat);

        if (Object.keys(listCompat).length)
            orConditions.push({ compatibilidad: { $elemMatch: listCompat } });
    }

    if (orConditions.length > 0) filter.$or = orConditions;

    console.log("🔸 filtro construido:", JSON.stringify(filter, null, 2));

    const skip = (page - 1) * pageSize;

    const products = await Product.find(filter).skip(skip).limit(pageSize);

    console.log("🔸 productos encontrados:", products.length);

    return products.map((p) => p.toObject());
}








module.exports = {

    addProduct,
    updateProduct,
    deleteProduct,
    getAllProducts,
    getProduct,
    getFeaturedProducts,
    getNewProducts,
    getProductForListing,
    // Exportar las nuevas funciones
    getProductsByMainCompatibility,
    getProductsByCompatibility,
    addCompatibility,
    removeCompatibility,
    updateMainCompatibility
}