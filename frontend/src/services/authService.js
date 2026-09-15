import api from "../utils/api";

// send OTP
export const sendOtp = (phone) => {
  return api.post("/auth/send-otp", { phone }, { withCredentials: true });
};

// verify OTP
export const verifyOtp = (phone, otp) => {
  return api.post(
    "/auth/verify-otp",
    {
      phone,
      otp,
    },
    { withCredentials: true },
  );
};
