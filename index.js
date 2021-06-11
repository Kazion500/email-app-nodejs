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

const sendEmail = async (email, body, subject) => {
  const transporter = nodeMailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD,
    },
  });

  const mailOptions = {
    from: "propzi.com <info@sparkspur.com> ",
    to: email,
    subject,
    html: body,
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
  const { recipientEmail, email, message, sharedLink } = req.body;
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
  if (!sharedLink) {
    return res.status(400).send({ error: "Shared Link is required" });
  }
  const subject = `SHARED PROPZI LISTING`;
  let templateBody = `
        <p>Hello!! ${recipientEmail}</p>
        <p style='width:400px'>
            <b>${email}</b> Has sent you a link to a property you would be interest in
            click the link below to view it.
        </p>
        <a href="${sharedLink}">View Property</a>
    `;
  if (message) {
    templateBody += `<p style='width:400px'>${message}</p> `;
  }
  try {
    const response = await sendEmail(email, templateBody, subject);
    return res.status(200).send({ message: response.message });
  } catch (error) {
    res.status(500).send({ error: error.message, code: error.code });
  }
});

// app.post("/request-tour", async (req, res) => {
//   const { recipientEmail, email, message, sharedLink } = req.body;
//   if (!recipientEmail || !email) {
//     return res
//       .status(400)
//       .send({ error: "Your email and Recipient Email is required" });
//   }
//   if (!validateEmail(recipientEmail)) {
//     return res.status(400).send({ error: "Enter a valid email" });
//   }
//   if (!validateEmail(email)) {
//     return res.status(400).send({ error: "Enter a valid email" });
//   }
//   if (!sharedLink) {
//     return res.status(400).send({ error: "Shared Link is required" });
//   }
//   const templateBody = `
//         <b>${email}</b> Has sent you a link to a property you would be interest in
//         click the link below to view it.

//         <a href="${sharedLink}">View Property</a>
//     `;
//   try {
//     const response = await sendEmail(email, recipientEmail, templateBody);
//     return res.status(200).send({ message: response.message });
//   } catch (error) {
//     res.status(500).send({ error: error.message, code: error.code });
//   }
// });

app.post("/contact-agent", async (req, res) => {
  const { email, message, name, phone } = req.body;
  if (!email || email === "") {
    return res.status(400).send({ error: "email is required" });
  }

  if (!validateEmail(email)) {
    return res.status(400).send({ error: "Enter a valid email" });
  }
  if (!message || message === "") {
    return res.status(400).send({ error: "Message is required" });
  }
  if (!name || name === "") {
    return res.status(400).send({ error: "Name is required" });
  }
  if (!phone || phone === "") {
    return res.status(400).send({ error: "Phone is required" });
  }

  const SUBJECT = "GOOD NEWS: YOU HAVE A NEW LEAD";

  try {
    const response = await sendEmail(email, message, SUBJECT);

    return res.status(200).send({ message: response.message });
  } catch (error) {
    res.status(500).send({ error: error.message, code: error.code });
  }
});

exports.website = functions.https.onRequest(app);
