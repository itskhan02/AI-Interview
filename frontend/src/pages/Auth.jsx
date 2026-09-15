import { BrainCircuit } from "lucide-react";
import { IoSparkles } from "react-icons/io5";
import { FcGoogle } from "react-icons/fc";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../utils/firebase";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";
import { useDispatch } from "react-redux";
import { setUserData } from "../redux/userSlice";
import logo from "../../public/logo.png";



const Auth = ({ isModel = false }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleGoogleSignIn = async () => {
    try {
      const response = await signInWithPopup(auth, provider);
      const user = response.user;
      const name = user.displayName;
      const email = user.email;

      const res = await api.post(
        "/auth/google",
        { name, email },
        { withCredentials: true },
      );

      dispatch(setUserData(res.data.user));
      localStorage.setItem("token", res.data.token);
      toast.success("Welcome to IntelliPrep.AI!");
      navigate("/");
    } catch {
      toast.error("Google sign-in failed. Please try again.");
      dispatch(setUserData(null));
    }
  };

  return (
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
          <span className="h-8 w-8 rounded-2xl  flex items-center justify-center shadow-lg">
            {/* <BrainCircuit size={20} className="text-amber-300" /> */}
              <img src={logo} alt="logo"></img>
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
          <p className="text-center text-sm px-6 md:px-0 text-gray-100 font-semibold leading-relaxed mb-2">
            Sign in to start AI-powered mock interviews and track your
            performance insights.
          </p>
        </div>

        <div className="flex flex-col items-center justify-center mb-6 gap-4">
          <motion.button
            type="button"
            onClick={handleGoogleSignIn}
            whileHover={{ scale: 1.02, opacity: 0.9 }}
            whileTap={{ scale: 0.98 }}
            className="w-60 flex items-center justify-center gap-2 bg-gradient-to-bl from-[#edd2f3] via-[#fffcdc] to-[#84dfff] rounded-full px-4 py-2 text-sm font-medium text-gray-700 shadow-md transition-all duration-200"
          >
            <FcGoogle size={20} />
            Sign in with Google
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

export default Auth;
