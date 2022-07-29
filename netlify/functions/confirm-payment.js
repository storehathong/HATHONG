// for a full working demo of Netlify Identity + Functions, see https://netlify-gotrue-in-react.netlify.com/

const fetch = require('node-fetch')
const axios = require('axios').default;
require('dotenv').config()

const handler = async function (event, context) {
  if (event.httpMethod === "POST" || event.httpMethod === "GET")
  {
    const requestBody = event.body;
    // console.log(requestBody);
    const SITE_URL = process.env.SITE_URL;
    const VNPAY_PORTAL = process.env.VNPAY_PORTAL;
    let searchParams = new URLSearchParams(requestBody);
    const paymentSessionId = searchParams.get("vnp_TxnRef");
    const transactionId = searchParams.get("vnp_BankTranNo");
    console.log("paymentSessionId: " + paymentSessionId);
    // console.log("transactionId: " + transactionId);

    const response = await fetch(
      `https://payment.snipcart.com/api/private/custom-payment-gateway/payment`, {
      method: 'POST',
      mode: 'cors',
      headers: {
        Authorization: `Bearer ${process.env.BEARER_TOKEN}`,
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin':'*',
        'Access-Control-Allow-Credentials': true,
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "GET, POST, OPTION"
      },
      body: JSON.stringify({
        paymentSessionId: paymentSessionId,
        state: "processed",
        transactionId: transactionId,
      }),
    });

    if (response.ok)
    {
      console.log(response);
      return {
        statusCode: 200,
        headers: {
          /* Required for CORS support to work */
          'Access-Control-Allow-Origin': '*',
          /* Required for cookies, authorization headers with HTTPS */
          'Access-Control-Allow-Credentials': true,
          "Access-Control-Allow-Headers": "Content-Type",
          "Access-Control-Allow-Methods": "GET, POST, OPTION"
        },
        body: JSON.stringify({ ok: true})
      };
    }
  }
  else if (event.httpMethod === "OPTIONS")
  {
    return {
      statusCode: 200,
      headers: {
        /* Required for CORS support to work */
        'Access-Control-Allow-Origin': '*',
        /* Required for cookies, authorization headers with HTTPS */
        'Access-Control-Allow-Credentials': true,
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "GET, POST, OPTION"
      },
      body: JSON.stringify({ message: "Successful preflight call."}),
    };
  }
  else
  {
    console.log("Fail");
  }
}

module.exports = { handler }
