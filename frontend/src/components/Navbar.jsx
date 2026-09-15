import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  BrainCircuit,
  Menu,
  X,
  User,
  LogOut,
  ChevronDown,
  Settings,
} from "lucide-react";
import { BsCoin } from "react-icons/bs";
import { useSelector, useDispatch } from "react-redux";
import toast from "react-hot-toast";
import api from "../utils/api";
import { setUserData } from "../redux/userSlice";

const Navbar = ({ openAuth }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const { userData } = useSelector((state) => state.user);

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [creditPopup, setCreditPopup] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);

  const dropdownRef = useRef(null);
  const creditRef = useRef(null);

  const links = [
    { to: "/", label: "Home" },
    // { to: "/dashboard", label: "Dashboard" },
    { to: "/interview", label: "Interview" },
    // { to: "/resume-analyzer", label: "Resume Analyzer" },
    { to: "/history", label: "Interview History" },
  ];

  const mobileExtraLinks = [
    { to: "/profile", label: "Profile Settings", icon: User },
    // { to: "/settings", label: "Settings", icon: Settings },
  ];

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }

      if (creditRef.current && !creditRef.current.contains(event.target)) {
        setCreditPopup(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  const isActive = (route) => {
    return location.pathname === route;
  };

  const handleProtectedNavigation = (route) => {
    if (userData) {
      navigate(route);

      setMobileMenu(false);
      setDropdownOpen(false);
      setCreditPopup(false);
    } else {
      setMobileMenu(false);
      openAuth?.();
    }
  };

  const handleLogout = async () => {
    try {
      await api.get("/auth/logout", {
        withCredentials: true,
      });

      localStorage.removeItem("token");

      dispatch(setUserData(null));

      setDropdownOpen(false);
      setMobileMenu(false);
      setCreditPopup(false);

      toast.success("Logged out successfully!");

      navigate("/");
    } catch (error) {
      console.error(error);
      toast.error("Logout failed");
    }
  };

  const navButtonClass = (active) => `
    px-3 py-1.5 rounded-md text-sm font-medium border transition-all duration-300
    ${
      active
        ? `
          bg-teal-500/20
          text-teal-400
          border-teal-500/40
          shadow-[0_0_12px_rgba(20,184,166,0.25)]
        `
        : `
          border-transparent
          text-gray-300
          hover:text-white
          hover:bg-teal-500/10
          hover:border-teal-600/50
          hover:shadow-[0_0_10px_rgba(45,212,191,0.15)]
          hover:scale-[1.02]
        `
    }
  `;

  return (
    <>
      <motion.header
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="fixed top-0 left-0 right-0 z-50 flex justify-center px-4 pt-4"
      >
        <nav className="w-full max-w-3xl glass-strong rounded-3xl px-6 py-2 flex items-center justify-between border border-white/10 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.25)]">
          {/* Logo */}

          <Link to="/" className="flex items-center gap-3 shrink-0">
            <span className="h-8 w-8 rounded-2xl bg-gradient-to-br from-violet-600 to-cyan-500 flex items-center justify-center shadow-lg">
              <BrainCircuit size={20} className="text-amber-300" />
            </span>

            <span className="gradient-text font-bold text-lg">
              IntelliPrep.AI
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-4">
            {userData &&
              links.map((link) => (
                <button
                  key={link.to}
                  type="button"
                  onClick={() => handleProtectedNavigation(link.to)}
                  className={navButtonClass(isActive(link.to))}
                >
                  {link.label}
                </button>
              ))}
          </div>

          <div className="flex items-center gap-6">
            {/* Credits */}

            {userData && (
              <div className="relative" ref={creditRef}>
                <button
                  type="button"
                  onClick={() => setCreditPopup((prev) => !prev)}
                  className="flex items-center gap-2 bg-gray-100/10 px-2 py-1 text-sm rounded-2xl border border-transparent hover:text-white hover:bg-teal-500/10 hover:border-teal-500/30 hover:scale-[1.02] transition-all duration-200 group">
                  <BsCoin
                    size={18}
                    className="text-yellow-500 group-hover:scale-110 transition-transform"/>

                  <span className="font-semibold">
                    {userData?.credits || 0}
                  </span>
                </button>

                <AnimatePresence>
                  {creditPopup && (
                    <motion.div
                      initial={{
                        opacity: 0,
                        y: -10,
                        scale: 0.95,
                      }}
                      animate={{
                        opacity: 1,
                        y: 0,
                        scale: 1,
                      }}
                      exit={{
                        opacity: 0,
                        y: -10,
                        scale: 0.95,
                      }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 mt-3 w-72 bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-2xl z-50 overflow-hidden">
                      {/* Credit Header */}

                      <div className="px-4 py-3 dark:bg-gray-800">
                        <div className="flex items-center gap-2">
                          <div
                            className="h-8 w-8 rounded-full bg-white/20 backdrop-blur flex items-center justify-center">
                            <BsCoin size={18} className="text-yellow-400" />
                          </div>

                          <h4 className="text-base font-semibold text-white">
                            Your Credits
                          </h4>
                        </div>
                      </div>

                      {/* Credit Content */}

                      <div className="p-4">
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            Available Credits
                          </span>

                          <span className="text-lg font-bold text-teal-600 dark:text-teal-400">
                            {userData?.credits || 0}
                          </span>
                        </div>

                        {/* Progress */}

                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-3">
                          <div
                            className="bg-gradient-to-r from-teal-500 to-cyan-500 h-2 rounded-full transition-all duration-500"
                            style={{
                              width: `${Math.min(
                                ((userData?.credits || 0) / 200) * 100,
                                100,
                              )}%`,
                            }}
                          />
                        </div>

                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-4 text-center">
                          {userData?.credits === 0
                            ? "You've run out of credits. Please purchase more to continue."
                            : userData?.credits < 50
                              ? "Low credits! Consider purchasing more soon."
                              : "Keep practicing to improve your interview skills!"}
                        </p>

                        <Link
                          to="/pricing"
                          onClick={() => setCreditPopup(false)}
                          className="flex justify-center items-center py-2 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 text-white hover:from-teal-600 hover:to-cyan-600 transition-all text-sm font-medium shadow-lg hover:shadow-xl">
                          Buy Credits
                        </Link>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {/* Login */}

            {!userData ? (
              <button
                type="button"
                onClick={() => openAuth?.()}
                className="hidden md:flex px-3 py-1 rounded-xl text-base font-medium border bg-teal-500/20 text-teal-400 border-teal-500/40 shadow-[0_0_12px_rgba(20,184,166,0.25)] hover:bg-teal-500/10 hover:border-teal-600/50 hover:shadow-[0_0_10px_rgba(45,212,191,0.15)] hover:scale-[1.02] transition-all duration-300">
                Login
              </button>
            ) : (

              /* User Dropdown */
              <div className="relative hidden md:block" ref={dropdownRef}>
                <button
                  type="button"
                  onClick={() => setDropdownOpen((prev) => !prev)}
                  className="flex items-center gap-2 h-8 w-8 justify-center rounded-full bg-teal-500/10 hover:bg-teal-500/20 transition-all duration-200 text-teal-400 text-[14px] font-bold ring-1 ring-teal-500/60 hover:ring-teal-500/50 hover:scale-105 px-2">
                  {userData?.profileImage ? (
                    <img
                      src={userData.profileImage}
                      alt="Profile"
                      className="h-8 w-8 rounded-full object-cover"
                    />
                  ) : (
                    userData?.name?.slice(0, 2).toUpperCase() ||
                    userData?.email?.slice(0, 1)?.toUpperCase() ||
                    "U"
                  )}
                </button>

                <AnimatePresence>
                  {dropdownOpen && (
                    <motion.div
                      initial={{
                        opacity: 0,
                        scale: 0.98,
                        y: -10,
                      }}
                      animate={{
                        opacity: 1,
                        scale: 1,
                        y: 0,
                      }}
                      exit={{
                        opacity: 0,
                        scale: 0.98,
                        y: -10,
                      }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-3 w-72 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-2xl z-50 overflow-hidden">
                      {/* User Info */}

                      <div
                        className="p-4 border-b border-gray-100 dark:border-gray-800 bg-gradient-to-r from-teal-50/50 to-cyan-50/50 dark:from-gray-800/50 dark:to-gray-800/50">
                        <div className="flex items-center gap-3">
                          <button
                            type="button"
                            onClick={() => setDropdownOpen((prev) => !prev)}
                            className="flex items-center h-8 w-8 justify-center rounded-full bg-teal-500/10 hover:bg-teal-500/20 transition-all duration-200 text-teal-400 text-[14px] font-bold ring-1 ring-teal-500/60 hover:ring-teal-500/50 hover:scale-105 overflow-hidden" >
                            {userData?.profileImage ? (
                              <img
                                src={userData.profileImage}
                                alt="Profile"
                                className="h-full w-full rounded-full object-cover"
                              />
                            ) : (
                              userData?.name?.slice(0, 2).toUpperCase() ||
                              userData?.email?.slice(0, 1)?.toUpperCase() ||
                              "U"
                            )}
                          </button>

                          <div className="flex flex-col gap-1 flex-1 min-w-0">
                            <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
                              {userData?.name || "User Name"}
                            </h4>

                            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                              {userData?.email ||
                                userData?.phone ||
                                "No contact info"}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Dropdown Items */}

                      <div className="p-2">
                        <Link
                          to="/profile"
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all group">
                          <User
                            size={18}
                            className="
                              text-gray-400
                              group-hover:text-teal-500
                              transition-colors
                            "
                          />

                          <span className="flex-1">Profile Settings</span>

                          <ChevronDown
                            size={14}
                            className="text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity -rotate-90"/>
                        </Link>

                        <div className="h-px bg-gray-100 dark:bg-gray-800 my-1" />

                        <button
                          type="button"
                          onClick={handleLogout}
                          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 transition-all group">
                          <LogOut size={18} className="text-red-500" />

                          <span className="flex-1 text-left">Logout</span>
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {/* Mobile Menu Button */}

            <button
              type="button"
              onClick={() => setMobileMenu(true)}
              className="md:hidden h-10 w-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-teal-500/10 hover:border-teal-500/30 transition-all duration-300">
              <Menu size={20} />
            </button>
          </div>
        </nav>
      </motion.header>

      {/* Mobile Menu */}

      <AnimatePresence>
        {mobileMenu && (
          <>
            {/* Overlay */}

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 md:hidden"
              onClick={() => setMobileMenu(false)}
            />

            {/* Sidebar */}

            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{
                type: "spring",
                damping: 25,
                stiffness: 200,
              }}
              className="fixed top-0 right-0 h-full w-80 max-w-[85vw] bg-[#111827] border-l border-gray-800 z-50 p-5 flex flex-col md:hidden">
              {/* Header */}

              <div className="flex items-center justify-between mb-8">
                <h2 className="text-xl font-bold text-white">Menu</h2>

                <button
                  type="button"
                  onClick={() => setMobileMenu(false)}
                  className="h-10 w-10 rounded-xl bg-white/5 flex items-center justify-center text-white hover:bg-teal-500/10 transition-all duration-300">
                  <X size={18} />
                </button>
              </div>

              {/* User */}

              {userData && (
                <div
                  className="mb-6 p-4 rounded-2xl bg-white/5 border border-white/10">
                  <div className="flex items-center gap-3">
                    <div
                      className="h-12 w-12 rounded-full bg-gradient-to-br from-violet-600 to-cyan-500 flex items-center justify-center text-white font-bold">
                      {userData?.profileImage ? (
                        <img
                          src={userData.profileImage}
                          alt="Profile"
                          className="h-full w-full rounded-full object-cover"
                        />
                      ) : (
                        userData?.name?.slice(0, 2)?.toUpperCase() || "U"
                      )}
                    </div>

                    <div className="min-w-0">
                      <h4 className="text-white font-semibold truncate">
                        {userData?.name || "User"}
                      </h4>

                      <p className="text-xs text-gray-400 truncate">
                        {userData?.email || userData?.phone}
                      </p>
                    </div>
                  </div>

                  {/* Mobile Credits */}

                  <div
                    className="mt-4 flex items-center justify-between p-2 bg-teal-500/10 rounded-xl">
                    <div className="flex items-center gap-2">
                      <BsCoin size={16} className="text-yellow-500" />

                      <span className="text-xs font-medium text-white">
                        Credits
                      </span>
                    </div>

                    <span className="text-sm font-bold text-teal-400">
                      {userData?.credits || 0}
                    </span>
                  </div>
                </div>
              )}

              {/* Mobile Navigation */}

              <div className="flex flex-col gap-2">
                {userData &&
                  links.map((link) => (
                    <button
                      key={link.to}
                      type="button"
                      onClick={() => handleProtectedNavigation(link.to)}
                      className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium border transition-all duration-300

                        ${
                          isActive(link.to)
                            ? `
                              bg-teal-500/20
                              text-teal-400
                              border-teal-500/40
                            `
                            : `
                              border-transparent
                              text-gray-300
                              hover:text-white
                              hover:bg-teal-500/10
                              hover:border-teal-600/50
                              hover:shadow-[0_0_10px_rgba(45,212,191,0.15)]
                              hover:scale-[1.01]
                            `
                        }
                      `}
                    >
                      {link.label}
                    </button>
                  ))}

                {userData &&
                  mobileExtraLinks.map((link) => {
                    const Icon = link.icon;

                    return (
                      <button
                        key={link.to}
                        type="button"
                        onClick={() => {
                          navigate(link.to);
                          setMobileMenu(false);
                        }}
                        className={`w-full flex items-center gap-3 text-left px-4 py-3 rounded-xl text-sm border border-transparent transition-all duration-300
                          ${
                            isActive(link.to)
                              ? `
                                bg-teal-500/20
                                text-teal-400
                                border-teal-500/40
                              `
                              : `
                                text-gray-300
                                hover:text-white
                                hover:bg-teal-500/10
                                hover:border-teal-600/50
                              `
                          }
                        `}
                      >
                        <Icon size={18} />

                        {link.label}
                      </button>
                    );
                  })}
              </div>

              {/* Bottom Login / Logout */}

              <div className="mt-auto pt-6">
                {!userData ? (
                  <button
                    type="button"
                    onClick={() => {
                      setMobileMenu(false);
                      openAuth?.();
                    }}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-600 text-white font-semibold hover:shadow-lg hover:shadow-cyan-500/20 transition-all duration-300">
                    Login
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="w-full py-3 rounded-xl bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/15 transition-all duration-300">
                    <span className="inline-flex items-center gap-2">
                      <LogOut size={18} />
                      Logout
                    </span>
                  </button>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
