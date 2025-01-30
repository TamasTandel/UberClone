const twilio = require('twilio');
const OTP = require('../models/otp.model');

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;

const client = twilio(accountSid, authToken);

const sendOtp = async (req, res) => {
  const { phone } = req.body;
  if (!phone) {
    return res.status(400).send('Phone number is required');
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  await OTP.create({ phone, otp });

  client.messages.create({
    body: `Your OTP is ${otp}`,
    from: '+18482943258', //14155238886 or 18777804236
    to: phone
  }).then(message => {
    res.send('OTP sent successfully');
  }).catch(error => {
    console.error('Error sending OTP:', error);
    res.status(500).send('Failed to send OTP');
  });
};

const verifyOtp = async (req, res) => {
  const { phone, otp } = req.body;
  const validOtp = await OTP.findOne({ phone, otp });

  if (validOtp) {
    res.send('OTP verified successfully');
  } else {
    res.status(400).send('Invalid OTP');
  }
};

module.exports = { sendOtp, verifyOtp };
