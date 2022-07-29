// for a full working demo of Netlify Identity + Functions, see https://netlify-gotrue-in-react.netlify.com/

// const fetch = require('./fetch.min.js')
// import fetch from 'node-fetch';

var URljson = {};
let reponse_output;
const handler = async function (event, context) {
    const axios = require('axios').default;
    const request = JSON.parse(event.body);
    console.log(request);
    var currency = request.content.currency;
    var country = request.content.shippingAddressCountry;
    var weight = request.content.totalWeight;
    var province = request.content.shippingAddressProvince;
    console.log(request.content.customFields[1]);
    if (request.content.customFields[1].value != "null"){
        province = request.content.customFields[1].value;
    };
    console.log("current province: " + province);
    if (weight == "0"){
        weight = 500;
    }
    const response = await axios.get(`https://api.myems.vn/EmsDosmetic?CountryCode=${country}&FromProvince=0&FromDistrict=0&ToProvince=0&ToDistrict=0&weight=${weight}&totalAmount=0&Istype=2&language=0`)
    .then(function (response) {
        // handle success
        console.log(response.data);
        reponse_output = response.data;
    })
    .catch(function (error) {
        // handle error
        console.log(error);
    })
    console.log(reponse_output);
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
    else {
        if (currency == "vnd" ){
            URljson = {
                rates: [{
                    cost: reponse_output.Message[0].Rates,
                    description: `International shipping | Giao hàng Quốc Tế`
                    }]
                }
        } else {
            var usd = Math.round((Number(reponse_output.Message[0].Rates))/22000);
            URljson = {
                rates: [{
                    cost: usd,
                    description: `International shipping | Giao hàng Quốc Tế`
                    }]
                }
        }

    }




  return {
    statusCode: 200,
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify(URljson),
  }
}

module.exports = { handler }
