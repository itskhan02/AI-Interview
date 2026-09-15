import { X } from "lucide-react";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import Auth from "../pages/Auth";

const AuthModel = ({ onClose }) => {
  const { userData } = useSelector((state) => state.user);

  useEffect(() => {
    if (userData) {
      onClose();
    }
  }, [userData, onClose]);

  return (
    <div
      className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 px-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        transition={{ duration: 0.25 }}
        className="relative w-full max-w-md"
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3  rounded-full p-2 text-white hover:bg-gray-700 transition "
        >
          <X size={20} color="white"/>
        </button>

        <Auth isModel />
      </motion.div>
    </div>
  );
};

export default AuthModel;
