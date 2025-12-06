const mongoose = require("mongoose");
const wishListSchema = new mongoose.Schema({
    userId: { type: Schema.Types.ObjectId, ref: "users" },
    productsId: Array(String)
});
const Wishlist = mongoose.model("wishlists", wishListSchema);
module.exports = Wishlist;