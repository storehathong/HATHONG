// for a full working demo of Netlify Identity + Functions, see https://netlify-gotrue-in-react.netlify.com/

// const fetch = require('./fetch.min.js')
// import fetch from 'node-fetch';

var URljson = {};
let reponse_output;
const handler = async function (event, context) {
  const axios = require("axios").default;
  const request = JSON.parse(event.body);
  console.log(request);
  var currency = request.content.currency;
  var country = request.content.shippingAddress.country;
  var weight = request.content.totalWeight;
  if (weight == "0") {
    weight = 1000;
  }
  //   const response = await axios
  //     .get(
  //       `https://api.myems.vn/EmsDosmetic?CountryCode=${country}&FromProvince=0&FromDistrict=0&ToProvince=0&ToDistrict=0&weight=${weight}&totalAmount=0&Istype=2&language=0`
  //     )
  //     .then(function (response) {
  //       // handle success
  //       // console.log(response.data);
  //       reponse_output = response.data;
  //     })
  //     .catch(function (error) {
  //       // handle error
  //       console.log(error);
  //     });
  //   console.log(reponse_output);

  if (currency == "vnd") {
    if (country == "VN") {
      URljson = {
        rates: [
          {
            cost: 30000,
            description: `Local Shipping`,
          },
        ],
      };
    } else {
      URljson = {
        rates: [
          {
            cost: 2000000,
            description: `International shipping`,
          },
        ],
      };
    }
  } else if (currency == "cny") {
    if (country == "VN") {
      URljson = {
        rates: [
          {
            cost: Math.round(30000 / 3500),
            description: `Local Shipping`,
          },
        ],
      };
    } else {
      var cny = Math.round(2000000 / 3500);
      URljson = {
        rates: [
          {
            cost: cny,
            description: `International shipping`,
          },
        ],
      };
    }
  } else if (currency == "usd") {
    if (country == "VN") {
      URljson = {
        rates: [
          {
            cost: Math.round(30000 / 22000),
            description: `Local Shipping`,
          },
        ],
      };
    } else {
      var usd = Math.round(2000000 / 22000);
      URljson = {
        rates: [
          {
            cost: usd,
            description: `International shipping`,
          },
        ],
      };
    }
  }

  return {
    statusCode: 200,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(URljson),
  };
};

module.exports = { handler };
