// for a full working demo of Netlify Identity + Functions, see https://netlify-gotrue-in-react.netlify.com/

// const axios = require('axios').default;
// require('dotenv').config();
const fetch = require('node-fetch');

const handler = async function (event, context) {
  // Get request's body
  const request = JSON.parse(event.body);

  console.log("request");
  console.log(request);

  const API_URL = process.env.API_URL || 'https://localhost:12666';
  const SITE_URL = process.env.SITE_URL || 'http://localhost:3000';
  console.log(request);

  var currency = request.content.currency;
  var country = request.content.shippingAddressCountry;
  var weight = request.content.totalWeight;

  if (weight == "0"){
    weight = 05;
  }
  var province = request.content.shippingAddressProvince;
  var URljson = {};

  console.log(URljson);
  console.log(currency);
  console.log(country);
  console.log(weight);
  console.log(province);
  var noi_thanh = ["Quận 1", "Quận 2", "Quận 3", "Quận 4", "Quận 5", "Quận 6", "Quận 7", "Quận 8", "Quận 10", "Quận 11", "Tân Bình", "Tân Phú", "Phú Nhuận", "Bình Thạnh", "Gò Vấp"];
  var ngoai_thanh = ["Quận 9", "Quận 12", "Thủ Đức", "Bình Tân", "Hóc Môn", "Bình Chánh", "Nhà Bè", "Củ Chi"];

  if (country == "VN"){
    console.log("country is VN");
    if (noi_thanh.indexOf(province) > -1 )
    {
      console.log("noi thanh");
      if (currency == "vnd" ){
        URljson = {
          rates: [{
            cost: 26000,
            description: `Domestic shipping | Giao hàng Nội Địa`
            }]
        }
      } else {
        URljson = {
          rates: [{
            cost: 2,
            description: `Domestic shipping | Giao hàng Nội Địa`
            }]
        }
      }
    }
    else if (ngoai_thanh.indexOf(province) > -1)
    {
      console.log("ngoai thanh");
      if (currency == "vnd" ){
        URljson = {
          rates: [{
            cost: 30000,
            description: `Domestic shipping | Giao hàng Nội Địa`
            }]
        }
      } else {
        URljson = {
          rates: [{
            cost: 2,
            description: `Domestic shipping | Giao hàng Nội Địa`
            }]
        }
      }
    }
    else
    {
      console.log("cac tinh khac");
      if (currency == "vnd" ){
        URljson = {
          rates: [{
            cost: 40000,
            description: `Domestic shipping | Giao hàng Nội Địa`
            }]
        }
      } else {
        URljson = {
          rates: [{
            cost: 2,
            description: `Domestic shipping | Giao hàng Nội Địa`
            }]
        }
      }
    }
  }
  else
  {
    const response = await fetch(`https://api.myems.vn/EmsDosmetic?CountryCode=${country}&FromProvince=0&FromDistrict=0&ToProvince=0&ToDistrict=0&weight=${weight}&totalAmount=0&Istype=2&language=0`)
    // .then(function (response) {
    //     // handle success
    //     console.log(response.data);
    //     reponse_output = response.data;
    // })
    // .catch(function (error) {
    //     // handle error
    //     console.log(error);
    // })
    const body = await response.json();

    console.log(body);
  //   // const body = {"Code":"00","Message":[{"Type":"1","Description":"QT","Rates":"10000","J":"2-3"}]};

  //   var message = JSON.stringify(body.Message);

  //   console.log(message);
  //   console.log(message[0]);

  //   var int_rate = Number(message[0].Rates);
  //   var estimated_deleivery = message[0].J;
  //   // console.log(int_rate);
  //   // console.log(estimated_deleivery);
  //   if (currency == vnd ){
  //     URljson = {
  //       rates: [{
  //         cost: int_rate,
  //         description: `International shipping | Giao hàng Quốc Tế - ${estimated_deleivery} days | ngày`
  //         }]
  //     }
  //   } else {
  //     usd_rate = Math.round(int_rate/22000);
  //     URljson = {
  //       rates: [{
  //         cost: usd_rate,
  //         description: `International shipping | Giao hàng Quốc Tế - ${estimated_deleivery} days | ngày`
  //         }]
  //     }
  //   }

  }

  // Create payment method list
  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(URljson)
  }
}

module.exports = { handler }

