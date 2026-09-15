import twilio from "twilio";

const sendOTP = async (phone, otp) => {
  try {
    const { TWILIO_SID, TWILIO_AUTH_TOKEN, TWILIO_PHONE } = process.env;

    if (!TWILIO_SID || !TWILIO_AUTH_TOKEN || !TWILIO_PHONE) {
      throw new Error("Twilio configuration missing");
    }

    const client = twilio(TWILIO_SID, TWILIO_AUTH_TOKEN);

    const message = await client.messages.create({
      body: `Your OTP for AI Interview Prep is ${otp}. Valid for 5 minutes. Do not share this code.`,
      from: TWILIO_PHONE,
      to: phone,
    });

    return message;
  } catch (error) {
    console.error("Twilio SMS failed:", error.message);
    throw error;
  }
};

export default sendOTP;
