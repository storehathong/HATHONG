// for a full working demo of Netlify Identity + Functions, see https://netlify-gotrue-in-react.netlify.com/

const fetch = require('node-fetch')
const axios = require('axios').default;
require('dotenv').config()

const handler = async function (event, context) {
  if (event.httpMethod === "POST" || event.httpMethod === "GET")
  {
    let event_body = event.body.substring(1).slice(0, -1);
    console.log(event_body);
    var link = new URL(event_body);
    let searchParams = new URLSearchParams(link.search);
    let URLLink;
    let returnURL;
    const SITE_URL = process.env.SITE_URL
    const current_lang = searchParams.get("current_lang");
    const publicToken_str = searchParams.get("publicToken");
    console.log("current_lang: " + current_lang);
    console.log("publicToken_str: " + publicToken_str);
    // Validate that the request is coming from Snipcart
    const validate = await fetch(`https://payment.snipcart.com/api/public/custom-payment-gateway/validate?publicToken=${publicToken_str}`, {
      mode: 'no-cors',
      headers: {
        'Access-Control-Allow-Origin':'*'
      },
    })
    // //Return 404 if the request is not from Snipcart
    if (!validate.ok)
    {
      console.log("response not ok");
      console.log(validate);
      return {
          statusCode: 404,
          headers: {
            /* Required for CORS support to work */
            'Access-Control-Allow-Origin': '*',
            /* Required for cookies, authorization headers with HTTPS */
            'Access-Control-Allow-Credentials': true,
            "Access-Control-Allow-Headers": "Content-Type",
            "Access-Control-Allow-Methods": "GET, POST, OPTION"
          },
          body: "",
        }
    }

    let reponse_output;

    const response = await axios.get(`https://payment.snipcart.com/api/public/custom-payment-gateway/payment-session?publicToken=${publicToken_str}`, {
      mode: 'cors',
      headers: {
        'Access-Control-Allow-Origin':'*'
      },
     })
    .then(function (response) {
        // handle success
        console.log(response.data);
        reponse_output = response.data;
    })
    .catch(function (error) {
        // handle error
        console.log(error);
    })
    console.log(reponse_output.paymentMethod);
    returnURL = reponse_output.invoice.targetId;
    console.log("returnURL: " + returnURL);
    if (reponse_output.paymentMethod === "local-bank")
    {
        URLLink = await generateURl('VNBANK', current_lang, reponse_output);
    }
    else if(reponse_output.paymentMethod === "international-bank")
    {
        URLLink = await generateURl('INTCARD', current_lang, reponse_output);
    }
    else if(reponse_output.paymentMethod === "cod")
    {
        URLLink = `${SITE_URL}xac-nhan-thanh-toan-cod?cod=${reponse_output.id}`;
    }
    console.log(URLLink);
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
      body: JSON.stringify({ message: "Successful preflight call.", vnpURL: URLLink, returnURL: returnURL}),
    };
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


async function generateURl(bankcode, lang, request)
{
  const SITE_URL = process.env.SITE_URL;
  let IPresponse = await fetch('http://ip-api.com/json', {
    mode: 'cors',
    headers: {
      'Access-Control-Allow-Origin':'*'
    },
  });
  let data = await IPresponse.text();
  const readdata = JSON.parse(data);
  var ipAddr = readdata.query;

  var tmnCode = process.env.vnp_TmnCode;
  var secretKey = process.env.vnp_HashSecret;
  var vnpUrl = process.env.vnp_Url;
  var returnUrl = `${SITE_URL}xac-nhan-thanh-toan`;
  //   var vnp_IpnUrl = 'https://secure-whiteplan.netlify.app/.netlify/functions/confirm-payment';
  //process.env.SITE_URL + '#/order/' + request.invoice.targetId;
  // console.log("returnUrl" + returnUrl);

  var date = new Date();
  var mm = date.getMonth() + 1;
  var dd = date.getDate();
  var yy = date.getFullYear();
  var HH = date.getHours();
  var mmi = date.getMinutes();
  var ss = date.getSeconds();
  var datestring = String(yy) + String(mm).padStart(2, '0') + String(dd).padStart(2, '0') + String(HH).padStart(2, '0') + String(mmi).padStart(2, '0') + String(ss).padStart(2, '0');

  var createDate = datestring;
  var orderId = request.id;
  var amount = request.invoice.amount;
  var bankCode = bankcode;

  var orderInfo = 'Thanh toan don hang website';
  var orderType = 200000;
  var locale = lang;
  var currCode = 'VND';
  var vnp_Params = {};
  vnp_Params['vnp_Version'] = '2.1.0';
  vnp_Params['vnp_Command'] = 'pay';
  vnp_Params['vnp_TmnCode'] = tmnCode;
  // vnp_Params['vnp_Merchant'] = ''
  vnp_Params['vnp_Locale'] = locale;
  vnp_Params['vnp_OrderType'] = orderType;
  vnp_Params['vnp_CurrCode'] = currCode;
  vnp_Params['vnp_TxnRef'] = orderId;
  vnp_Params['vnp_OrderInfo'] = orderInfo;
  vnp_Params['vnp_OrderType'] = 'other';
  vnp_Params['vnp_Amount'] = amount * 100;
  vnp_Params['vnp_ReturnUrl'] = returnUrl;
  vnp_Params['vnp_IpAddr'] = ipAddr;
  vnp_Params['vnp_CreateDate'] = createDate;
  //   vnp_Params['vnp_IpnUrl'] = vnp_IpnUrl;

  if(bankCode !== null && bankCode !== ''){
    vnp_Params['vnp_BankCode'] = bankCode;
  }

  vnp_Params = sortObject(vnp_Params);

  var querystring = require('qs');
  var signData = querystring.stringify(vnp_Params, { encode: false });
  var crypto = require("crypto-js");
  var hmac = crypto.createHmac("sha512", secretKey);
  var signed = hmac.update(Buffer.from(signData, 'utf-8')).digest("hex");
  vnp_Params['vnp_SecureHash'] = signed;
  vnpUrl += '?' + querystring.stringify(vnp_Params, { encode: false });
  // console.log("vnpUrl: " + vnpUrl);
  return vnpUrl;
  }

function sortObject(obj)
{
  var sorted = {};
  var str = [];
  var key;
  for (key in obj){
  if (obj.hasOwnProperty(key)) {
  str.push(encodeURIComponent(key));
  }
  }
  str.sort();
  for (key = 0; key < str.length; key++) {
      sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, "+");
  }
  return sorted;
}