require("dotenv").config();
// const paypal = require("paypal-rest-sdk");
const { client, paypal } = require("../../helper/paypal");
const Order = require("../../models/Order");
const Cart = require("../../models/Cart");
const createOrder = async (req, res) => {
  try {
    const {
      userId,
      cartId,
      cartItems,
      addressInfo,
      orderStatus,
      paymentMethod,
      paymentStatus,
      totalAmount,
      orderDate,
      orderUpdateDate,
    } = req.body;

    console.log("Creating order with data:", req.body);

    // إنشاء طلب PayPal
    const request = new paypal.orders.OrdersCreateRequest();
    request.requestBody({
      intent: "CAPTURE",
      purchase_units: [
        {
          items: cartItems.map((item) => ({
            name: item.title,
            sku: item.productId,
            unit_amount: {
              currency_code: "USD",
              value: item.price.toFixed(2),
            },
            quantity: item.quantity.toString(),
          })),
          amount: {
            currency_code: "USD",
            value: totalAmount.toFixed(2),
            breakdown: {
              item_total: {
                currency_code: "USD",
                value: totalAmount.toFixed(2),
              },
            },
          },
        },
      ],
      application_context: {
        return_url: "http://localhost:5173/shop/paypal-return",
        cancel_url: "http://localhost:5173/shop/paypal-cancel",
        brand_name: "Your Store Name",
        user_action: "PAY_NOW",
      },
    });

    const response = await client().execute(request);
    const order = response.result;

    const newlyCreatedOrder = new Order({
      userId,
      cartId,
      cartItems,
      addressInfo,
      orderStatus: "Pending", // يمكنك تعيين حالة افتراضية
      paymentMethod: "paypal",
      paymentStatus: "Pending",
      totalAmount,
      orderDate: new Date(),
      orderUpdateDate: new Date(),
      paymentId: order.id,
      payerId: null,
    });

    await newlyCreatedOrder.save();

    const approvalURL = order.links.find(
      (link) => link.rel === "approve"
    )?.href;

    res.status(200).json({
      success: true,
      approvalURL,
      orderId: newlyCreatedOrder._id,
      paypalOrderId: order.id,
    });
  } catch (err) {
    console.error("Error in createOrder:", err);
    res.status(500).json({
      success: false,
      message: "Error occurred while creating order",
      error: err.message,
    });
  }
};

const capturePayment = async (req, res) => {
  try {
    const { paymentId, payerId, orderId } = req.body;
    let order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    order.paymentStatus = "paid";
    order.orderStatus = "confirmed";
    order.paymentId = paymentId;
    order.payerId = payerId;

    const getCartId = order.cartId;
    await Cart.findByIdAndDelete(getCartId);

    res.status(200).json({
      success: true,
      message: "Payment captured successfully",
      order: order,
    });

    await order.save();
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: "Error Occured",
    });
  }
};

const getAllOrderByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const orders = await Order.find({ userId });

    if (!orders.length) {
      return res.status(404).json({
        success: false,
        message: "No orders found",
      });
    }

    res.status(200).json({
      success: true,
      data: orders,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: "Error Occured",
    });
  }
};

const getOrderDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: "Error Occured",
    });
  }
};
module.exports = {
  createOrder,
  capturePayment,
  getAllOrderByUser,
  getOrderDetails,
};
