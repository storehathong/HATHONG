var link = "?cod=6b6b3af6-05e722e1-aff1-4e1d-bb3b-d8ccfd62ddd9";
let searchParams = new URLSearchParams(link);
let URLLink;
let returnURL;
const cod = searchParams.get("cod");
// const publicToken_str = searchParams.get("publicToken");
//console.log(cod);
// console.log(publicToken_str);

// var URljson =
// {
//   "rates": [{
//     "cost": 10,
//     "description": "10$ shipping"
//     }, {
//     "cost": 20,
//     "description": "20$ shipping",
//     "guaranteedDaysToDelivery": 5
//     },
//   ]
// }
// console.log(URljson);

// body = {"Code":"00","Message":[{"Type":"1","Description":"QT","Rates":"0","J":"2-3"}]};

// var int_rate = Number(body.Message[0].Rates);
// var estimated_deleivery = body.Message[0].J;

// console.log(int_rate);
// console.log(estimated_deleivery);

// var URljson = {
//     rates: [{
//       cost: int_rate,
//       description: `International shipping | Giao hàng Quốc Tế - ${estimated_deleivery} days | ngày`
//       }]
//   }

// console.log(URljson);
var URljson = [
    {
      name: 'province-input',
      type: 'textbox',
      options: null,
      required: false,
      value: null,
      operation: null,
      optionsArray: null
    },
    {
      name: 'district-select',
      displayValue: 'Bình Tân',
      type: 'textbox',
      options: null,
      required: false,
      value: 'Bình Tân',
      operation: null,
      optionsArray: null
    },
    {
      name: 'ward-select',
      type: 'textbox',
      options: null,
      required: false,
      value: null,
      operation: null,
      optionsArray: null
    },
    {
      name: 'ThongTinThem',
      type: 'textbox',
      options: null,
      required: false,
      value: null,
      operation: null,
      optionsArray: null
    }
  ]
  console.log(URljson[1]);
// var weight = 1250.00; //grams
// console.log(weight/1000);
// console.log(Math.round(weight/1000));