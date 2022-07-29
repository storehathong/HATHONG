// for a full working demo of Netlify Identity + Functions, see https://netlify-gotrue-in-react.netlify.com/

const fetch = require('node-fetch')
const axios = require('axios').default;
require('dotenv').config()

const handler = async function (event, context) {
  // Get request's body
  const request = JSON.parse(event.body);
  console.log("request");
  console.log(request);
  const API_URL = process.env.API_URL || 'https://localhost:12666';
  const SITE_URL = process.env.SITE_URL || 'http://localhost:3000';

  // Validate that the request is coming from Snipcart
  const response = await fetch(`https://payment.snipcart.com/api/public/custom-payment-gateway/validate?publicToken=${request.publicToken}`)

  //Return 404 if the request is not from Snipcart
  if (!response.ok)
  {
    console.log("response not ok");
    console.log(response);
    return {
      statusCode: 404,
      body: "",
    }
  }

  var URljson =
    [
//       {
//       id: 'local-bank',
//       name: 'Ngân Hàng Nội Địa | Vietnamese Local Bank',
//       checkoutUrl: `${SITE_URL}thanh-toan`,
//     },
//     {
//       id: 'international-bank',
//       name: 'Thẻ Quốc Tế | MASTERCARD, VISA',
//       checkoutUrl: `${SITE_URL}thanh-toan`,
//     },
    {
      id: 'cod',
      name: 'Trả Tiền Khi Nhận Hàng',
      checkoutUrl: `${SITE_URL}thanh-toan`,
    }]

    console.log(URljson);

  // Create payment method list
  return {
    statusCode: 200,
    body: JSON.stringify(URljson),
  }
}

module.exports = { handler }
