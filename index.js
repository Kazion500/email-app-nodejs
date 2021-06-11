require("dotenv").config();
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const express = require("express");
const nodeMailer = require("nodemailer");
const cors = require("cors");
const { validateEmail } = require("./helper");

const app = express();

admin.initializeApp();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(
  cors({ origin: ["localhost:3000", "https://propzi-website-v1.vercel.app/"] })
);


const sendEmail = async (email, recipientEmail) => {
  const transporter = nodeMailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD,
    },
  });

  const mailOptions = {
    from: email,
    to: recipientEmail,
    subject: "Propzi Listing From",
    text: "That was easy!",
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    return {
      message: "Success!!",
      info,
    };
  } catch (error) {
    throw Error(error.message);
  }
};

app.post("/share-listing", async (req, res) => {
  const { recipientEmail, email, message } = req.body;
  if (!recipientEmail || !email) {
    return res
      .status(400)
      .send({ error: "Your email and Recipient Email is required" });
  }
  if (!validateEmail(recipientEmail)) {
    return res.status(400).send({ error: "Enter a valid email" });
  }
  if (!validateEmail(email)) {
    return res.status(400).send({ error: "Enter a valid email" });
  }

  try {
    const response = await sendEmail(email, recipientEmail);
    return res.status(200).send({ message: response.message });
  } catch (error) {
    res.status(500).send({ error: error.message, code: error.code });
  }
});

exports.website = functions.https.onRequest(app);
