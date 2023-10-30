const express = require("express");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");
const cors = require("cors");

require("dotenv").config();

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

// Health check endpoint
app.get("/health-check", (req, res) => {
  res.status(200).send("Server is up and running");
});

// sanitize function to remove unwanted characters from input data
function sanitize(input) {
  return input.replace(/(<([^>]+)>)/gi, "");
}

// handle POST request to '/report-issue'
app.post("/report-issue", async (req, res) => {
  // extract data from request body
  try {
    const { issueText, email, phoneNumber } = req.body;

    // validate input data
    if (!issueText || !email || !phoneNumber) {
      return res.status(400).send("Missing required fields");
    }

    // sanitize input data
    const sanitizedIssueText = sanitize(issueText);
    const sanitizedEmail = sanitize(email);
    const sanitizedPhoneNumber = sanitize(phoneNumber);

    // create email transport
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_HOST_USER || "", // replace with your Gmail email
        pass: process.env.EMAIL_HOST_PASSWORD || "", // replace with your Gmail password
      },
    });

    // send email
    const mailOptions = {
      from: process.env.EMAIL_HOST_USER || "", // replace with your Gmail email
      to: process.env.EMAIL_RECEIVER || "", // replace with internal employee email
      subject: "New issue report",
      html: `
      <p><strong>Issue Text:</strong> ${sanitizedIssueText}</p>
      <p><strong>Email:</strong> ${sanitizedEmail}</p>
      <p><strong>Phone Number:</strong> ${sanitizedPhoneNumber}</p>
    `,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).send("Issue reported successfully");
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal server error");
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Internal Server Error");
});

// app.listen(port, () => console.log(`Server listening on port ${port}`));
module.exports.handler = app;
