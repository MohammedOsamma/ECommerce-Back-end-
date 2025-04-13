require("dotenv").config();
const paypal = require("@paypal/checkout-server-sdk");

const environment = () => {
  const clientId = process.env.PAYPAL_CLIENT_ID;
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET;

  return process.env.PAYPAL_ENVIRONMENT === "LIVE"
    ? new paypal.core.LiveEnvironment(clientId, clientSecret)
    : new paypal.core.SandboxEnvironment(clientId, clientSecret);
};

const client = () => {
  return new paypal.core.PayPalHttpClient(environment());
};

module.exports = { client, paypal }; // تصدير كائن paypal أيضاً
