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

  const [formData, setFormData] = useState({
    name: "",
    bio: "",
    targetRole: "",
    education: "",
    experience: "",
    location: "",
  });

  const [preview, setPreview] = useState("");

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

      toast.success("Profile updated successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to permanently delete your account? This action cannot be undone.",
    );

    if (!confirmed) return;

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
    }
  };

  if (!userData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-950 text-white">
        <p>Please login to view your profile.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 px-10 py-10">
      <motion.button
        whileHover={{
          scale: 1.04,
          x: -2,
        }}
        whileTap={{ scale: 0.95 }}
        onClick={() => navigate("/history")}
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-slate-400 transition-all duration-300 hover:border-cyan-400/30 hover:bg-cyan-400/10 hover:text-cyan-400"
      >
        <FaArrowLeft className="text-sm" />
      </motion.button>
      <div className="max-w-6xl mx-auto">
        <div className="my-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>

            <h1 className="text-2xl md:text-3xl font-bold text-white">
              Profile Settings
            </h1>
          </div>

          <p className="text-gray-400">
            Manage your personal information and IntelliPrep profile.
          </p>
        </div>

        <div className="bg-gray-900/80 border border-gray-800 rounded-3xl shadow-2xl overflow-hidden">
          <div className="p-6 md:p-8">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 pb-8 border-b border-gray-800">
              <div className="relative">
                <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-gray-800 bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center">
                  {preview ? (
                    <img
                      src={preview}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="w-12 h-12 text-white" />
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  className="absolute bottom-0 right-0 w-9 h-9 rounded-full bg-purple-600 hover:bg-purple-700 text-white flex items-center justify-center shadow-lg transition"
                >
                  <Camera className="w-4 h-4" />
                </button>

                <input
                  ref={fileRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </div>

              <div className="text-center sm:text-left">
                <h2 className="text-xl font-semibold text-white">
                  {userData.name || "Your Name"}
                </h2>

                <p className="text-gray-400 mt-1">
                  {userData.email || userData.phone || "IntelliPrep User"}
                </p>

                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  className="mt-4 text-sm text-purple-400 hover:text-purple-300"
                >
                  Change profile picture
                </button>

                <p className="text-xs text-gray-500 mt-1">
                  JPG, PNG or WebP · Maximum 5MB
                </p>
              </div>
            </div>

            <div className="py-8 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Full Name
                </label>

                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />

                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your name"
                    className="w-full bg-gray-800 border border-gray-700 text-white rounded-xl py-3 pl-11 pr-4 outline-none focus:border-purple-500 transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Email
                </label>

                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />

                  <input
                    type="email"
                    value={userData.email || ""}
                    disabled
                    className="w-full bg-gray-800/60 border border-gray-700 text-gray-500 rounded-xl py-3 pl-11 pr-4 cursor-not-allowed"
                  />
                </div>
              </div>

              {userData.phone && (
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Phone
                  </label>

                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />

                    <input
                      type="text"
                      value={userData.phone}
                      disabled
                      className="w-full bg-gray-800/60 border border-gray-700 text-gray-500 rounded-xl py-3 pl-11 pr-4 cursor-not-allowed"
                    />
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Target Role
                  </label>

                  <div className="relative">
                    <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />

                    <input
                      type="text"
                      name="targetRole"
                      value={formData.targetRole}
                      onChange={handleChange}
                      placeholder="e.g. Full Stack Developer"
                      className="w-full bg-gray-800 border border-gray-700 text-white rounded-xl py-3 pl-11 pr-4 outline-none focus:border-purple-500 transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Education
                  </label>

                  <div className="relative">
                    <GraduationCap className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />

                    <input
                      type="text"
                      name="education"
                      value={formData.education}
                      onChange={handleChange}
                      placeholder="e.g. B.Tech CSE"
                      className="w-full bg-gray-800 border border-gray-700 text-white rounded-xl py-3 pl-11 pr-4 outline-none focus:border-purple-500 transition"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Experience
                  </label>

                  <select
                    name="experience"
                    value={formData.experience}
                    onChange={handleChange}
                    className="w-full bg-gray-800 border border-gray-700 text-white rounded-xl py-3 px-4 outline-none focus:border-purple-500 transition"
                  >
                    <option value="">Select experience</option>
                    <option value="Fresher">Fresher</option>
                    <option value="0-1 years">0-1 years</option>
                    <option value="1-2 years">1-2 years</option>
                    <option value="2-5 years">2-5 years</option>
                    <option value="5+ years">5+ years</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Location
                  </label>

                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />

                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      placeholder="e.g. Punjab, India"
                      className="w-full bg-gray-800 border border-gray-700 text-white rounded-xl py-3 pl-11 pr-4 outline-none focus:border-purple-500 transition"
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
                  className="w-full bg-gray-800 border border-gray-700 text-white rounded-xl py-3 px-4 outline-none focus:border-purple-500 transition resize-none"
                />

                <p className="text-xs text-gray-500 text-right mt-1">
                  {formData.bio.length}/500
                </p>
              </div>
            </div>

            <div className="pt-6 border-t border-gray-800">
              <button
                type="button"
                onClick={handleSave}
                disabled={loading}
                className="w-full md:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-medium flex items-center justify-center gap-2 transition disabled:opacity-50"
              >
                {loading ? (
                  "Saving..."
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </div>

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

                <button
                  type="button"
                  onClick={handleDeleteAccount}
                  disabled={deleteLoading}
                  className="px-5 py-2.5 rounded-xl border border-red-500/40 text-red-400 hover:bg-red-500/10 transition flex items-center gap-2 disabled:opacity-50"
                >
                  <Trash2 className="w-4 h-4" />

                  {deleteLoading ? "Deleting..." : "Delete Account"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSetting;
