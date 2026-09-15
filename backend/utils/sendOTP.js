import twilio from "twilio";

const requiredTwilioEnvVars = ["TWILIO_SID", "TWILIO_AUTH_TOKEN", "TWILIO_PHONE"];

const sendOTP = async (phone, otp) => {
  try {
    const { TWILIO_SID, TWILIO_AUTH_TOKEN, TWILIO_PHONE } = process.env;
    const missingEnvVars = requiredTwilioEnvVars.filter((key) => !process.env[key]);

    if (missingEnvVars.length > 0) {
      throw new Error(`Twilio configuration missing: ${missingEnvVars.join(", ")}`);
    }

    const client = twilio(TWILIO_SID, TWILIO_AUTH_TOKEN);

    const message = await client.messages.create({
      body: `Your OTP for AI Interview Prep is ${otp}. Valid for 5 minutes. Do not share this code.`,
      from: TWILIO_PHONE,
      to: phone,
    });

    return message;
  } catch (error) {
    console.error("Twilio SMS failed:", {
      message: error.message,
      code: error.code,
      status: error.status,
      moreInfo: error.moreInfo,
    });
    throw error;
  }
};

export default sendOTP;
