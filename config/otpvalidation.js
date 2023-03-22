import dotenv from "dotenv";
import { default as Twilio } from "twilio";
dotenv.config();

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const serviceID = process.env.SSID;

const client = Twilio(accountSid, authToken);

export function sendsms(phone) {
  client.verify.v2
    .services(serviceID)
    .verifications.create({ to: `+91${phone}`, channel: "sms" })
    .then((verification) => console.log(verification.status));
}

export function verifysms(phone, otp) {
 
  return new Promise((resolve, reject) => {
    client.verify.v2
      .services(serviceID)
      .verificationChecks.create({ to:`+91${phone}`, code: otp })
      .then((verification_check) => {
        console.log(verification_check.status);
        resolve(verification_check);
      });
  });
}
