const fs = require("fs");
const axios = require("axios");

const data = JSON.parse(fs.readFileSync("dict/dict.json", "utf-8"));


data.forEach((obj) => {
    let config = {
      method: "post",
      url: "https://project-irula.azurewebsites.net/api/newWord",// need to update the link https://learnirula.azurewebsites.net/api/ but please check before you do the changes to the backend
      headers: {
        "Content-Type": "application/json",
      },
      data: JSON.stringify(obj),
    };
    axios
      .request(config)
      .then((response) => {
        console.log(JSON.stringify(response.data));
      })
      .catch((error) => {
        console.log(error);
      });

});
