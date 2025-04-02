const Cart = require("../../models/Cart.");
const Product = require("../../models/Product");

const addToCart = async (req, res) => {
  const { userId, productId, quantity } = req.body;
  try {
    if (!userId || !productId || quantity <= 0) {
      return res.status(500).json({
        success: false,
        message: "Invalid Data Prodvided",
      });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found!",
      });
    }

    let cart = await Cart.findOne({ userId });
    if (!cart) {
      cart = new Cart({ userId, items: [] });
    }

    const findCurrentProductIndex = cart.items.findIndex(
      (item) => item.productId.toString() === productId
    );

    if (findCurrentProductIndex === -1) {
      cart.items.push({ productId, quantity });
    } else {
      cart.items[findCurrentProductIndex].quantity += quantity;
    }

    await cart.save();

    res.status(200).json({
      success: true,
      data: cart,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: "Some Error Occured",
    });
  }
};

const fetchCartItem = async (req, res) => {
  try {
    const { userId } = req.params();
    if (!userId) {
      return res.status(400).josn({
        success: false,
        message: "User id is manadatory!",
      });
    }
    const cart = await Cart.findOne({ userId }).populate({
      path: "item.productId",
      select: "image title price salePrice",
    });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found!",
      });
    }

    const validItems = cart.items.filter(
      (productItem) => productItem.productId
    );

    if (validItems.length < cart.items.lemgth) {
      cart.items = validItems;
      await cart.save();
    }

    const populateCartItems = validItems.map((item) => ({
      productId: item.productId._id,
      image: item.productId.image,
      title: item.productId.title,
      price: item.productId.price,
      salePrice: item.productId.salePrice,
      quantity: item.productId.quantity,
    }));

    res.status(200).json({
      success: true,
      data: {
        ...cart._doc,
        items: populateCartItems,
      },
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: "Some Error Occured",
    });
  }
};

module.exports = {
  addToCart,
  fetchCartItem,
};
