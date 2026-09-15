import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  User,
  Camera,
  Save,
  Trash2,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  GraduationCap,
  Sparkles,
  AlertTriangle,
  Check,
  X,
} from "lucide-react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";
import { clearUserData, setUserData } from "../redux/userSlice";
import { FaArrowLeft } from "react-icons/fa";

const ProfileSetting = () => {
  const { userData } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const fileRef = useRef(null);

  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    bio: "",
    targetRole: "",
    education: "",
    experience: "",
    location: "",
  });

  const [preview, setPreview] = useState("");
  const [imageHover, setImageHover] = useState(false);

  useEffect(() => {
    if (userData) {
      setFormData({
        name: userData.name || "",
        bio: userData.bio || "",
        targetRole: userData.targetRole || "",
        education: userData.education || "",
        experience: userData.experience || "",
        location: userData.location || "",
      });

      setPreview(userData.profileImage || "");
    }
  }, [userData]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setHasChanges(true);
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      toast.error("Only JPG, PNG and WebP images are allowed");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be smaller than 5MB");
      return;
    }

    setPreview(URL.createObjectURL(file));
    setHasChanges(true);
  };

  const handleSave = async () => {
    if (!formData.name.trim()) {
      toast.error("Name is required");
      return;
    }

    try {
      setLoading(true);

      const data = new FormData();

      data.append("name", formData.name);
      data.append("bio", formData.bio);
      data.append("targetRole", formData.targetRole);
      data.append("education", formData.education);
      data.append("experience", formData.experience);
      data.append("location", formData.location);

      if (fileRef.current?.files?.[0]) {
        data.append("profileImage", fileRef.current.files[0]);
      }

      const res = await api.put("/user/update-profile", data);

      dispatch(setUserData(res.data.user));

      setPreview(res.data.user.profileImage || "");

      if (fileRef.current) {
        fileRef.current.value = "";
      }

      setHasChanges(false);
      toast.success("Profile updated successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      setDeleteLoading(true);

      await api.delete("/user/delete-account");

      localStorage.removeItem("token");
      dispatch(clearUserData());

      toast.success("Account deleted successfully");

      navigate("/login");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete account");
    } finally {
      setDeleteLoading(false);
      setShowDeleteConfirm(false);
    }
  };

  if (!userData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-950 text-white">
        <div className="text-center">
          <div className="w-16 h-16 rounded-2xl bg-gray-800 flex items-center justify-center mx-auto mb-4">
            <User className="w-8 h-8 text-gray-500" />
          </div>
          <p className="text-gray-400">Please login to view your profile.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 px-4 sm:px-6 lg:px-10 py-8 sm:py-10">
      <div className="max-w-6xl mx-auto">
        {/* Back button */}
        <motion.button
          whileHover={{ scale: 1.04, x: -2 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate("/history")}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-slate-400 transition-all duration-300 hover:border-cyan-400/30 hover:bg-cyan-400/10 hover:text-cyan-400 mb-6"
        >
          <FaArrowLeft className="text-sm" />
        </motion.button>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center shadow-lg shadow-purple-500/20">
              <Sparkles className="w-5 h-5 text-white" />
            </div>

            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-white">
                Profile Settings
              </h1>
              <p className="text-sm text-gray-400 mt-0.5">
                Manage your personal information and IntelliPrep profile.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gray-900/80 border border-gray-800 rounded-3xl shadow-2xl overflow-hidden backdrop-blur-xl">
          {/* Profile Header Section - Redesigned */}
          <div className="relative p-6 md:p-8 border-b border-gray-800">
            {/* Subtle gradient background */}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-purple-600/5 via-transparent to-blue-600/5" />

            <div className="relative flex flex-col items-center gap-6 sm:flex-row sm:items-center">
              {/* Profile Picture - Better Alignment */}
              <div className="relative shrink-0">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  onHoverStart={() => setImageHover(true)}
                  onHoverEnd={() => setImageHover(false)}
                  className="relative w-32 h-32 rounded-full overflow-hidden ring-4 ring-gray-800 ring-offset-4 ring-offset-gray-900 bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center shadow-xl shadow-purple-500/20"
                >
                  {preview ? (
                    <img
                      src={preview}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="w-14 h-14 text-white" />
                  )}

                  {/* Overlay on hover */}
                  {imageHover && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="absolute inset-0 bg-black/60 flex items-center justify-center cursor-pointer"
                      onClick={() => fileRef.current?.click()}
                    >
                      <Camera className="w-6 h-6 text-white" />
                    </motion.div>
                  )}
                </motion.div>

                {/* Camera button */}
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  className="absolute bottom-0 right-0 w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white flex items-center justify-center shadow-lg shadow-purple-500/30 border-2 border-gray-900 transition-all"
                >
                  <Camera className="w-4 h-4" />
                </motion.button>

                <input
                  ref={fileRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </div>

              {/* User Info - Better Alignment */}
              <div className="flex-1 text-center sm:text-left">
                <h2 className="text-2xl font-semibold text-white">
                  {userData.name || "Your Name"}
                </h2>

                <div className="mt-2 flex flex-col sm:flex-row items-center sm:items-start gap-1 sm:gap-3 text-gray-400">
                  {userData.email && (
                    <span className="flex items-center gap-1.5 text-sm">
                      <Mail className="w-4 h-4 text-gray-500" />
                      {userData.email}
                    </span>
                  )}
                  {userData.phone && (
                    <>
                      <span className="hidden sm:block text-gray-600">•</span>
                      <span className="flex items-center gap-1.5 text-sm">
                        <Phone className="w-4 h-4 text-gray-500" />
                        {userData.phone}
                      </span>
                    </>
                  )}
                </div>

                {/* Status badge */}
                <div className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-green-500/10 border border-green-500/20 px-3 py-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                  <span className="text-[11px] font-medium text-green-400">
                    Active
                  </span>
                </div>
              </div>

              {/* Save indicator on desktop */}
              {hasChanges && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="hidden sm:flex items-center gap-2 rounded-xl bg-amber-500/10 border border-amber-500/20 px-3 py-2"
                >
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                  <span className="text-xs font-medium text-amber-400">
                    Unsaved changes
                  </span>
                </motion.div>
              )}
            </div>
          </div>

          {/* Form Section */}
          <div className="p-6 md:p-8">
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Full Name <span className="text-red-400">*</span>
                  </label>

                  <div className="relative group">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 transition-colors group-focus-within:text-purple-400" />

                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Enter your name"
                      className="w-full bg-gray-800/70 border border-gray-700 text-white rounded-xl py-3 pl-11 pr-4 outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all placeholder:text-gray-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Email
                  </label>

                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-600" />

                    <input
                      type="email"
                      value={userData.email || ""}
                      disabled
                      className="w-full bg-gray-800/40 border border-gray-800 text-gray-500 rounded-xl py-3 pl-11 pr-4 cursor-not-allowed"
                    />
                  </div>
                </div>
              </div>

              {userData.phone && (
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Phone
                  </label>

                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-600" />

                    <input
                      type="text"
                      value={userData.phone}
                      disabled
                      className="w-full bg-gray-800/40 border border-gray-800 text-gray-500 rounded-xl py-3 pl-11 pr-4 cursor-not-allowed"
                    />
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Target Role
                  </label>

                  <div className="relative group">
                    <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 transition-colors group-focus-within:text-purple-400" />

                    <input
                      type="text"
                      name="targetRole"
                      value={formData.targetRole}
                      onChange={handleChange}
                      placeholder="e.g. Full Stack Developer"
                      className="w-full bg-gray-800/70 border border-gray-700 text-white rounded-xl py-3 pl-11 pr-4 outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all placeholder:text-gray-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Education
                  </label>

                  <div className="relative group">
                    <GraduationCap className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 transition-colors group-focus-within:text-purple-400" />

                    <input
                      type="text"
                      name="education"
                      value={formData.education}
                      onChange={handleChange}
                      placeholder="e.g. B.Tech CSE"
                      className="w-full bg-gray-800/70 border border-gray-700 text-white rounded-xl py-3 pl-11 pr-4 outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all placeholder:text-gray-600"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Experience
                  </label>

                  <div className="relative group">
                    <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 transition-colors group-focus-within:text-purple-400" />

                    <input
                      type="text"
                      name="experience"
                      value={formData.experience}
                      onChange={handleChange}
                      placeholder="e.g. Fresher, 6 months, 2 years"
                      className="w-full bg-gray-800/70 border border-gray-700 text-white rounded-xl py-3 pl-11 pr-4 outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all placeholder:text-gray-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Location
                  </label>

                  <div className="relative group">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 transition-colors group-focus-within:text-purple-400" />

                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      placeholder="e.g. Punjab, India"
                      className="w-full bg-gray-800/70 border border-gray-700 text-white rounded-xl py-3 pl-11 pr-4 outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all placeholder:text-gray-600"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  About You
                </label>

                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  maxLength={500}
                  rows={5}
                  placeholder="Tell us a little about yourself..."
                  className="w-full bg-gray-800/70 border border-gray-700 text-white rounded-xl py-3 px-4 outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all resize-none placeholder:text-gray-600"
                />

                <div className="flex justify-end mt-1">
                  <p
                    className={`text-xs ${
                      formData.bio.length > 450
                        ? "text-amber-400"
                        : "text-gray-500"
                    }`}
                  >
                    {formData.bio.length}/500
                  </p>
                </div>
              </div>
            </div>

            {/* Save Button */}
            <div className="pt-6 mt-6 border-t border-gray-800">
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                type="button"
                onClick={handleSave}
                disabled={loading || !hasChanges}
                className="w-full md:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-medium flex items-center justify-center gap-2 transition-all shadow-lg shadow-purple-500/20 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    Save Changes
                  </>
                )}
              </motion.button>
            </div>
          </div>

          {/* Danger Zone */}
          <div className="border-t border-red-900/40 bg-red-950/20 p-6 md:p-8">
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5 text-red-400" />
              </div>

              <div className="flex-1">
                <h3 className="text-lg font-semibold text-red-400">
                  Danger Zone
                </h3>

                <p className="text-sm text-gray-400 mt-1 mb-5">
                  Permanently delete your account and profile data. This action
                  cannot be undone.
                </p>

                {!showDeleteConfirm ? (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    onClick={() => setShowDeleteConfirm(true)}
                    className="px-5 py-2.5 rounded-xl border border-red-500/40 text-red-400 hover:bg-red-500/10 transition-all flex items-center gap-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete Account
                  </motion.button>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-wrap items-center gap-3"
                  >
                    <span className="text-sm text-red-300">Are you sure?</span>

                    <button
                      type="button"
                      onClick={handleDeleteAccount}
                      disabled={deleteLoading}
                      className="px-4 py-2 rounded-xl bg-red-500/20 border border-red-500/40 text-red-400 hover:bg-red-500/30 transition-all flex items-center gap-2 disabled:opacity-50"
                    >
                      {deleteLoading ? (
                        <>
                          <div className="w-4 h-4 border-2 border-red-400/30 border-t-red-400 rounded-full animate-spin" />
                          Deleting...
                        </>
                      ) : (
                        <>
                          <Check className="w-4 h-4" />
                          Yes, delete
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => setShowDeleteConfirm(false)}
                      className="px-4 py-2 rounded-xl border border-gray-700 text-gray-400 hover:bg-white/5 transition-all flex items-center gap-2"
                    >
                      <X className="w-4 h-4" />
                      Cancel
                    </button>
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSetting;
