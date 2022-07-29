// for a full working demo of Netlify Identity + Functions, see https://netlify-gotrue-in-react.netlify.com/

const fetch = require('node-fetch')
const axios = require('axios').default;
require('dotenv').config()

const handler = async function (event, context) {
  if (event.httpMethod === "POST" || event.httpMethod === "GET")
  {
    const requestBody = event.body;
    console.log(requestBody);
    let searchParams = new URLSearchParams(requestBody);
    const vnp_ResponseCode = searchParams.get("vnp_ResponseCode");
    const vnp_SecureHash = searchParams.get("vnp_SecureHash");
    const vnp_Amount = searchParams.get("vnp_Amount");
    const vnp_TransactionStatus = searchParams.get("vnp_TransactionStatus");
    console.log("vnp_ResponseCode: " + vnp_ResponseCode);
    console.log("vnp_SecureHash: " + vnp_SecureHash);
    console.log("vnp_Amount: " + vnp_Amount);

    var signed = generateCheckSum();

    if(vnp_SecureHash === signed)
    {
      if (vnp_ResponseCode != NULL)
      {
        if (vnp_Amount != NULL)
        {
          if (vnp_ResponseCode === '00' && vnp_TransactionStatus === '00')
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
              body: JSON.stringify({Message:"Confirm Success",RspCode:"00"})
            };
          }
          else
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
              body: JSON.stringify({Message:"Order already confirmed",RspCode:"02"})
            };
          }
        }
        else
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
              body: JSON.stringify({Message:"Invalid amount",RspCode:"04"})
            };
          }
      }
      else
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
          body: JSON.stringify({Message:"Order Not Found",RspCode:"01"})
        };
      }
    }
    else {
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
        body: JSON.stringify({RspCode: '97', Message: 'Fail Checksum'})
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

async function generateCheckSum()
{
  var secretKey = process.env.vnp_HashSecret;
  var querystring = require('qs');
  var signData = querystring.stringify(vnp_Params, { encode: false });
  var crypto = require("crypto-js");
  var hmac = crypto.createHmac("sha512", secretKey);
  var signed = hmac.update(Buffer.from(signData, 'utf-8')).digest("hex");
  return signed;
}