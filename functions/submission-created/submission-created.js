/* eslint-disable */
// require('dotenv').config()

// // details in https://css-tricks.com/using-netlify-forms-and-netlify-functions-to-build-an-email-sign-up-widget
const fetch = require("node-fetch").default;
const { GET_RESPONSE_TOKEN } = process.env;
const apiEndpoint = `https://api.getresponse.com/v3/contacts`;
const lists = [
  {
    name: `novatec_industial_web_products_req`,
    token: `KqbZ5`,
    id: `166811701`
  }
];
const formatData = ({ name, email, campaignId, phone, company }) =>
  JSON.stringify({
    name,
    email,
    campaign: {
      campaignId
    },
    customFieldValues: [
      {
        customFieldId: "Vjnecm",
        value: [phone]
      },
      {
        customFieldId: "VjnJhw",
        value: [company]
      },
      {
        customFieldId: "VP4wqx",
        value: ["Website"]
      }
    ]
  });
exports.handler = async (event, context, callback) => {
  console.log({ event });
  const data = JSON.parse(event.body);
  const { nombre, email, tel, empresa } = data;
  console.log(`Recieved a submission: ${email}`);
  return fetch(apiEndpoint, {
    method: "POST",
    headers: {
      "X-Auth-Token": `api-key ${GET_RESPONSE_TOKEN}`,
      "Content-Type": "application/json"
    },
    body: formatData({
      name: nombre,
      email,
      campaignId: lists[0].token,
      phone: tel,
      company: empresa
    })
  })
    .then(response => response.json())
    .then(data => {
      console.log(
        `Submitted to getresponse:\n ${JSON.stringify(data, null, 2)}`
      );
    })
    .catch(error => ({ statusCode: 422, body: String(error) }));
};