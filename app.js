import "dotenv/config";
import express from "express";
import fetch from "node-fetch";
import bodyParser from "body-parser";
const app = express();

app.set("view engine", "ejs");
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.render("index");
});

app.post("/", async (req, res) => {
  let inputs = {
    amount: req.body.Amount,
    from: req.body.From,
    to: req.body.To,
  };

  let ExchangeApi = await fetch(
    `https://api.apilayer.com/exchangerates_data/convert?to=${inputs.to}&from=${inputs.from}&amount=${inputs.amount}`,
    {
      method: "GET",
      redirect: "follow",
      headers: { apikey: process.env.API_KEY },
    }
  );
  let ExchangeResponse = await ExchangeApi.json();
  console.log(ExchangeResponse);

  if (ExchangeResponse.success === true) {
    res.render("index", {
      success: true,
      Date: ExchangeResponse.date,
      Rate: ExchangeResponse.info.rate,
      Result: ExchangeResponse.result,
      Symbol: ExchangeResponse.query.to,
    });
  } else {
    res.render("index", {
      success: false,
      Message: ExchangeResponse.error.message,
    });
  }
});

app.listen(process.env.PORT || 3000, () => {
  console.log("Server started on port 3000");
});
