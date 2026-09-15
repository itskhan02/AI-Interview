import { useState, useEffect } from "react";
import {
  BrainCircuit,
  X,
  ChevronLeft,
  Smartphone,
  ShieldCheck,
  Clock,
} from "lucide-react";
import { IoSparkles } from "react-icons/io5";
import { FcGoogle, FcPhoneAndroid } from "react-icons/fc";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../utils/firebase";
import ReactPhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { useNavigate } from "react-router-dom";
import { sendOtp, verifyOtp } from "../services/authService";
import api from "../utils/api";
import { useDispatch } from "react-redux";
import { setUserData } from "../redux/userSlice";



const PhoneInput = ReactPhoneInput.default || ReactPhoneInput;
const phoneRegex = /^\+[1-9]\d{7,14}$/;
const otpRegex = /^\d{6}$/;

const Auth = ({isModel = false}) => {
  const [showPhoneModal, setShowPhoneModal] = useState(false);
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const [phoneError, setPhoneError] = useState("");

  const navigate = useNavigate();

  const dispatch = useDispatch();

  const getFormattedPhone = () => {
    const digits = phone.replace(/\D/g, "");
    return digits ? `+${digits}` : "";
  };

  const handleGoogleSignIn = async () => {
    try {
      const response = await signInWithPopup(auth, provider);
      let user = response.user;
      let name = user.displayName;
      let email = user.email;

      const res = await api.post("/auth/google", { name, email}, {withCredentials: true });

      dispatch(setUserData(res.data.user));

      toast.success("Welcome to IntelliPrep.AI!");

      localStorage.setItem("token", res.data.token);

      navigate("/");

    } catch {
      toast.error("Google sign-in failed. Please try again.");
      
      dispatch(setUserData(null));
    }
  };

  useEffect(() => {
    let interval;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

  const validatePhone = () => {
    const formattedPhone = getFormattedPhone();

    if (!phoneRegex.test(formattedPhone)) {
      setPhoneError("Please enter a valid phone number with country code");
      return false;
    }

    setPhoneError("");
    return true;
  };

  const handleSendOtp = async () => {
    if (!validatePhone()) return;

    try {
      setLoading(true);
      await sendOtp(getFormattedPhone());

      toast.success("OTP sent successfully!");

      setStep(2);
      setResendTimer(30);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (resendTimer > 0) return;
    if (!validatePhone()) return;

    try {
      setLoading(true);
      await sendOtp(getFormattedPhone());
      toast.success("OTP resent successfully!");

      setResendTimer(30);

    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to resend OTP");

    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otpRegex.test(otp)) {
      toast.error("Please enter the 6-digit OTP");
      return;
    }

    try {
      setLoading(true);
      const res = await verifyOtp(getFormattedPhone(), otp);
      localStorage.setItem("token", res.data.token);
      toast.success("Login Successful! Welcome to IntelliPrep.AI!");

      dispatch(setUserData(res.data.user));

      navigate("/");

      setTimeout(() => {
        setShowPhoneModal(false);
        resetModal();
      }, 1000);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Invalid OTP. Please try again.",
      );
      dispatch(setUserData(null));
    } finally {
      setLoading(false);
    }
  };

  const resetModal = () => {
    setStep(1);
    setPhone("");
    setOtp("");
    setPhoneError("");
    setResendTimer(0);
  };

  const handleClose = () => {
    setShowPhoneModal(false);
    resetModal();
  };

  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = `
      .phone-input-container .country-list {
        background: rgba(31, 41, 55, 0.95) !important;
        backdrop-filter: blur(10px) !important;
        border: 1px solid rgba(255, 255, 255, 0.1) !important;
        border-radius: 12px !important;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2) !important;
      }
      
      .phone-input-container .country {
        background: transparent !important;
        color: white !important;
        transition: all 0.2s ease !important;
      }
      
      .phone-input-container .country:hover {
        background: rgba(255, 255, 255, 0.1) !important;
      }
      
      .phone-input-container .country.highlight,
      .phone-input-container .country.selected {
        background: rgba(139, 92, 246, 0.3) !important;
        backdrop-filter: blur(5px) !important;
        border-left: 3px solid #8b5cf6 !important;
        color: white !important;
      }
      
      .phone-input-container .search-container input {
        background: rgba(31, 41, 55, 0.95) !important;
        backdrop-filter: blur(10px) !important;
        color: white !important;
        border: 1px solid rgba(255, 255, 255, 0.1) !important;
        border-radius: 8px !important;
      }
      
      .phone-input-container .search-container input::placeholder {
        color: rgba(255, 255, 255, 0.5) !important;
      }
      
      .phone-input-container .dial-code {
        color: rgba(255, 255, 255, 0.7) !important;
      }
      
      .phone-input-container .selected-dial-code {
        color: white !important;
      }
      
      .phone-input-container .country-list::-webkit-scrollbar {
        width: 6px;
      }
      
      .phone-input-container .country-list::-webkit-scrollbar-track {
        background: rgba(255, 255, 255, 0.05);
        border-radius: 10px;
      }
      
      .phone-input-container .country-list::-webkit-scrollbar-thumb {
        background: rgba(139, 92, 246, 0.5);
        border-radius: 10px;
      }
      
      .phone-input-container .country-list::-webkit-scrollbar-thumb:hover {
        background: rgba(139, 92, 246, 0.8);
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return (
    <>
      <div
        className={`w-full flex items-center justify-center ${
          isModel
            ? "min-h-0"
            : "min-h-screen px-6 py-20 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900"
        }`}
      >
        <motion.div
          initial={isModel ? false : { opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: isModel ? 0 : 1.05 }}
          className={`w-full max-w-md glass relative rounded-3xl p-6 shadow-[0_8px_32px_rgba(0,0,0,0.37)] neon-border ${
            isModel ? "bg-gray-900" : ""
          }`}
        >
          <div className="flex items-center justify-center mb-6 gap-3">
            <span className="h-8 w-8 inline-flex rounded-xl bg-gradient-to-br from-violet-600 to-cyan-500 items-center justify-center">
              <BrainCircuit className="text-amber-300" />
            </span>
            <h2 className="gradient-text font-bold text-lg">IntelliPrep.AI</h2>
          </div>

          <div className="flex flex-col items-center justify-center mb-6 gap-3">
            <h1 className="text-xl font-semibold text-center flex flex-col items-center justify-center gap-2">
              Continue with{" "}
              <span className="bg-[conic-gradient(at_top_left,_var(--tw-gradient-stops))] from-[#eef5ff] via-[#b4d4ff] to-[#86b6f6] text-green-600 text-lg md:text-lg px-3 py-1 font-semibold rounded-full inline-flex items-center gap-2">
                <IoSparkles size={17} />
                AI Smart Interview
              </span>
            </h1>
            <p className="text-center text-sm px-6 md:px-0 text-gray-500 leading-relaxed mb-2">
              Sign in to start AI-powered mock interviews and track your
              performance insights.
            </p>
          </div>

          <div className="flex flex-col items-center justify-center mb-6 gap-4">
            <motion.button
              onClick={handleGoogleSignIn}
              whileHover={{ scale: 1.02, opacity: 0.9 }}
              whileTap={{ scale: 0.98 }}
              className="w-60 flex items-center justify-center gap-2 bg-gradient-to-bl from-[#edd2f3] via-[#fffcdc] to-[#84dfff] rounded-full px-4 py-2 text-sm font-medium text-gray-700 shadow-md transition-all duration-200"
            >
              <FcGoogle size={20} />
              Sign in with Google
            </motion.button>

            <motion.button
              onClick={() => setShowPhoneModal(true)}
              whileHover={{ scale: 1.02, opacity: 0.9 }}
              whileTap={{ scale: 0.98 }}
              className="w-60 flex items-center justify-center gap-2 bg-gradient-to-bl from-[#edd2f3] via-[#fffcdc] to-[#84dfff] rounded-full px-4 py-2 text-sm font-medium text-gray-700 shadow-md transition-all duration-200"
            >
              <FcPhoneAndroid size={20} />
              Sign in with Phone
            </motion.button>
          </div>
        </motion.div>
      </div>

      <AnimatePresence>
        {showPhoneModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 px-4"
            onClick={handleClose}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="w-full max-w-md bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl overflow-hidden shadow-2xl border border-gray-700"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative bg-gradient-to-r from-purple-600 to-blue-600 px-6 py-4">
                <button
                  type="button"
                  aria-label="Close phone verification"
                  onClick={handleClose}
                  className="absolute right-4 top-4 p-1 hover:bg-white/10 rounded-full transition-colors"
                >
                  <X className="w-5 h-5 text-white" />
                </button>

                {step === 2 && (
                  <button
                    type="button"
                    aria-label="Back to phone number"
                    onClick={() => {
                      setStep(1);
                      setOtp("");
                    }}
                    className="absolute left-4 top-4 p-1 hover:bg-white/10 rounded-full transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5 text-white" />
                  </button>
                )}

                <div className="flex flex-col items-center text-center">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mb-3">
                    {step === 1 ? (
                      <Smartphone className="w-6 h-6 text-white" />
                    ) : (
                      <ShieldCheck className="w-6 h-6 text-white" />
                    )}
                  </div>
                  <h2 className="text-2xl font-bold text-white">
                    {step === 1 ? "Phone Verification" : "Enter OTP"}
                  </h2>
                  <p className="text-white/80 text-sm mt-1">
                    {step === 1
                      ? "We'll send a verification code to your phone"
                      : `Code sent to +${phone}`}
                  </p>
                </div>
              </div>

              <div className="p-6">
                {step === 1 ? (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label
                        htmlFor="phone-number"
                        className="text-sm font-medium text-gray-300"
                      >
                        Phone Number
                      </label>
                      <div className="phone-input-container">
                        <PhoneInput
                          country={"in"}
                          value={phone}
                          onChange={(phone) => {
                            setPhone(phone.replace(/\D/g, ""));
                            setPhoneError("");
                          }}
                          inputProps={{
                            id: "phone-number",
                            name: "phone",
                            autoComplete: "tel",
                            "aria-invalid": Boolean(phoneError),
                            "aria-describedby": phoneError
                              ? "phone-error"
                              : undefined,
                          }}
                          inputStyle={{
                            width: "100%",
                            height: "52px",
                            background: "#1f2937",
                            color: "white",
                            border: phoneError
                              ? "2px solid #ef4444"
                              : "1px solid #374151",
                            borderRadius: "12px",
                            fontSize: "16px",
                          }}
                          buttonStyle={{
                            background: "#1f2937",
                            border: "1px solid #374151",
                          }}
                          dropdownStyle={{
                            background: "rgba(31, 41, 55, 0.95)",
                            backdropFilter: "blur(10px)",
                            color: "white",
                            border: "1px solid rgba(255, 255, 255, 0.1)",
                            borderRadius: "12px",
                            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.2)",
                            scrollbarWidth: "none",
                          }}
                          containerStyle={{
                            width: "100%",
                          }}
                          searchStyle={{
                            background: "rgba(31, 41, 55, 0.95)",
                            backdropFilter: "blur(10px)",
                            color: "white",
                            border: "1px solid rgba(255, 255, 255, 0.1)",
                            borderRadius: "8px",
                          }}
                          containerClass="phone-input-container"
                        />
                      </div>
                      {phoneError && (
                        <p
                          id="phone-error"
                          className="text-red-400 text-xs mt-1"
                        >
                          {phoneError}
                        </p>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={handleSendOtp}
                      disabled={loading}
                      className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white py-3 rounded-xl font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02]"
                    >
                      {loading ? (
                        <div className="flex items-center justify-center gap-2">
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          <span>Sending...</span>
                        </div>
                      ) : (
                        "Send Verification Code"
                      )}
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label
                        htmlFor="otp-code"
                        className="text-sm font-medium text-gray-300"
                      >
                        Verification Code
                      </label>
                      <input
                        id="otp-code"
                        name="otp"
                        type="text"
                        inputMode="numeric"
                        autoComplete="one-time-code"
                        placeholder="Enter 6-digit OTP"
                        value={otp}
                        onChange={(e) =>
                          setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
                        }
                        className="w-full bg-gray-800 border border-gray-700 text-white p-3 rounded-xl focus:outline-none focus:border-purple-500 transition-colors text-center text-2xl tracking-wider"
                        autoFocus
                        maxLength={6}
                      />
                      <p className="text-gray-400 text-xs flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        OTP expires in 5 minutes
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={handleVerifyOtp}
                      disabled={loading || otp.length !== 6}
                      className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white py-3 rounded-xl font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02]"
                    >
                      {loading ? (
                        <div className="flex items-center justify-center gap-2">
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          <span>Verifying...</span>
                        </div>
                      ) : (
                        "Verify & Continue"
                      )}
                    </button>

                    <div className="text-center">
                      <button
                        type="button"
                        onClick={handleResendOtp}
                        disabled={resendTimer > 0}
                        className={`text-sm transition-colors ${
                          resendTimer > 0
                            ? "text-gray-500 cursor-not-allowed"
                            : "text-purple-400 hover:text-purple-300"
                        }`}
                      >
                        {resendTimer > 0
                          ? `Resend code in ${resendTimer}s`
                          : "Resend verification code"}
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <div className="px-6 pb-6 text-center">
                <p className="text-xs text-gray-500">
                  By continuing, you agree to our{" "}
                  <a href="#" className="text-purple-400 hover:text-purple-300">
                    Terms of Service
                  </a>{" "}
                  and{" "}
                  <a href="#" className="text-purple-400 hover:text-purple-300">
                    Privacy Policy
                  </a>
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Auth;
