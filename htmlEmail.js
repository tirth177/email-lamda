const AWS = require("aws-sdk");
const ses = new AWS.SES({ region: "us-east-1" });

exports.handler = async (event) => {
  try {
    const recipient = "recipient@example.com";
    const sender = "sender@example.com";

    // HTML content for the email
    const htmlBody = `
      <html>
        <body>
          <h1>Hello from AWS Lambda</h1>
          <p>This is an example HTML email.</p>
        </body>
      </html>
    `;

    // Define email parameters
    const params = {
      Destination: {
        ToAddresses: [recipient],
      },
      Message: {
        Body: {
          Html: {
            Data: htmlBody,
          },
        },
        Subject: {
          Data: "HTML Email Subject",
        },
      },
      Source: sender,
    };

    // Send the email
    const result = await ses.sendEmail(params).promise();
    console.log("Email sent:", result);

    return {
      statusCode: 200,
      body: JSON.stringify("HTML Email sent successfully."),
    };
  } catch (error) {
    console.error("Error sending email:", error);
    return {
      statusCode: 500,
      body: JSON.stringify("HTML Email sending failed."),
    };
  }
};
