require("dotenv").config();
// const paypal = require("paypal-rest-sdk");
const { client, paypal } = require("../../helper/paypal");
const Order = require("../../models/Order");
// const createOrder = async (req, res) => {
//   try {
//     const {
//       userId,
//       cartId,
//       cartItems,
//       addressInfo,
//       orderStatus,
//       paymentMethod,
//       paymentStatus,
//       totalAmount,
//       orderDate,
//       orderUpdateDate,
//       paymentId,
//       payerId,
//     } = req.body;

//     console.log("Creating order with data:", req.body);
//     const create_payment_json = {
//       intent: "sale",
//       payer: {
//         payment_method: "paypal",
//       },
//       redirect_urls: {
//         return_url: "http://localhost:5173/shop/paypal-return",
//         cancel_url: "http://localhost:5173/shop/paypal-cancel",
//       },
//       transactions: [
//         {
//           item_list: {
//             items: cartItems.map((item) => ({
//               name: item.title,
//               sku: item.productId,
//               price: item.price.toFixed(2),
//               currency: "USD",
//               quantity: item.quantity,
//             })),
//           },
//           amount: {
//             currency: "USD",
//             total: totalAmount.toFixed(2),
//           },
//           description: "description",
//         },
//       ],
//     };

//     paypal.payment.create(create_payment_json, async (error, paymentInfo) => {
//       if (error) {
//         console.log(error);
//         res.status(500).json({
//           success: false,
//           message: "Error Occured while creating payment",
//         });
//       } else {
//         const newlyCreatedOrder = new Order({
//           userId,
//           cartId,
//           cartItems,
//           addressInfo,
//           orderStatus,
//           paymentMethod,
//           paymentStatus,
//           totalAmount,
//           orderDate,
//           orderUpdateDate,
//           paymentId,
//           payerId,
//         });
//         await newlyCreatedOrder.save();
//         const approvalURL = paymentInfo.links.find(
//           (link) => link.rel === "approval_url"
//         )?.href;
//         res.status(200).json({
//           success: true,
//           approvalURL,
//           orderId: newlyCreatedOrder._id,
//         });
//       }
//     });
//   } catch (err) {
//     console.log(err);
//     res.status(500).json({
//       success: false,
//       message: "Error Occured",
//     });
//   }
// };

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
};
