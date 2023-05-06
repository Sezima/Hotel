const stripe = require("stripe")(
  "sk_test_51N45fEJBG4BmPRviMpVAXQig3nekiIeJqUBPymKAv5K9aRGcvEfbof5T8m3OcTGedlrlwoWH4aKsFAgbi2o8CkrD00iZe8Bg5S"
);
const express = require("express");
const app = express();
app.use(express.json());

app.use(express.static("public"));

const port = 3000;
// Define the route handler for the payment submission endpoint
app.post("/charge", async (req, res) => {
  try {
    // Retrieve the payment details from the request body
    let { cardNumber, cardExpiry, cardCVC, cardName, amount } = req.body;

    console.log("req.body :", req.body);
    // Create a Stripe token for the card details using the Stripe.js library
    const token = await stripe.tokens.create({
      card: {
        number: cardNumber,
        exp_month: cardExpiry.split("/")[0],
        exp_year: cardExpiry.split("/")[1],
        cvc: cardCVC,
        name: cardName,
      },
    });
    console.log("token :", token);

    // Use the token to create a charge on the customer's card
    const charge = await stripe.charges.create({
      amount: amount * 100, // Stripe requires the amount in cents, so multiply by 100
      currency: "usd",
      source: token.id,
      description: `Charge for ${cardName}`,
    });

    console.log("charge :", charge);

    // Send a success response to the client
    res.send({ status: "succeeded" });
  } catch (error) {
    // Send an error response to the client
    console.error(error);
    res.send({ status: "failed" });
  }
});

app.listen(port, () => console.log("listening on port", port));
