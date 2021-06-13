require("dotenv").config();
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const express = require("express");
const nodeMailer = require("nodemailer");
const cors = require("cors");
const { validateShareInput, validateContactInput } = require("./helper");

const app = express();

admin.initializeApp();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(
  cors({
    origin: ["http://localhost:3000", "https://propzi-website-v1.vercel.app/"],
  })
);

const sendEmail = async (email, body, subject) => {
  const transporter = nodeMailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD,
    },
  });

  const mailOptions = {
    from: "propzi.com <patrick@sparknspur.com> ",
    to: email,
    subject,
    html: body,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    return {
      message: "You Have Successfully Shared The Link!!",
      info,
    };
  } catch (error) {
    throw Error(error.message);
  }
};

app.post("/share-listing", async (req, res) => {
  const { recipientEmail, email, message, sharedLink } = req.body;

  const error = validateShareInput({
    email,
    recipientEmail,
  });

  if (Object.keys(error.errors).length) {
    return res.status(400).send(error);
  }

  const subject = `SHARED PROPZI LISTING`;
  let templateBody = `
        <p>Hello!! ${recipientEmail}</p>
        <p style='width:400px'>
            <b>${email}</b> Has shared a link to a property you would be interested in
            click the link below to check it out!!.
        </p>
        <a href="${sharedLink}">View Property</a>
    `;
  if (message) {
    templateBody += `<p style='width:400px'>${message}</p> `;
  }
  try {
    const response = await sendEmail(recipientEmail, templateBody, subject);

    return res.status(200).send({ message: response.message, success: true });
  } catch (error) {
    res.status(500).send({ error: error.message, success: false });
  }
});

app.post("/contact-agent", async (req, res) => {
  const { email, message, name, phone } = req.body;
  const error = validateContactInput({ email, message, name, phone });

  if (Object.keys(error.errors).length) {
    return res.status(400).send(error);
  }
  console.log(error);

  try {
    const SUBJECT = "GOOD NEWS: YOU HAVE A NEW LEAD";
    const response = await sendEmail(email, message, SUBJECT);

    return res.status(200).send({ message: response.message, success: true });
  } catch (error) {
    res.status(500).send({ error: error.message, success: false });
  }
});

exports.website = functions.https.onRequest(app);
