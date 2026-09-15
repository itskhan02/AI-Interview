import { useState} from "react";
import { motion } from "framer-motion";
import {
  HiSparkles,
} from "react-icons/hi2";
import {
  FaUserTie,
  FaBriefcase,
  FaFileUpload,
  FaMicrophone,
  FaChartLine,
} from "react-icons/fa";
import api from "../utils/api";
import { useDispatch, useSelector } from "react-redux";
import { setUserData } from "../redux/userSlice";

const features = [
  {
    icon: <FaUserTie className="text-green-600 text-xl" />,
    text: "Choose Role & Experience",
  },
  {
    icon: <FaMicrophone className="text-green-600 text-xl" />,
    text: "Smart Voice Interview",
  },
  {
    icon: <FaChartLine className="text-green-600 text-xl" />,
    text: "Performance Analytics",
  },
];


const getExperienceYears = (value) => {
  if (!value) return "";

  const match = value.match(/(\d+(?:\.\d+)?)\s*\+?\s*(years?|yrs?)/i);

  if (!match) return value.trim();

  const number = match[1];

  return `${number} ${number === "1" ? "year" : "years"}`;
};

const Step1Setup = ({ onStart }) => {
  const [role, setRole] = useState("");
  const [experience, setExperience] = useState("");
  const [mode, setMode] = useState("Technical Interview");
  const [resumeFile, setResumeFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [projects, setProjects] = useState([]);
  const [skills, setSkills] = useState([]);
  const [resumeText, setResumeText] = useState("");
  const [analysisDone, setAnalysisDone] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);

  const {userData} = useSelector((state) => state.user);

  const dispatch = useDispatch();


  const handleUploadResume = async () => {
    if (!resumeFile || analyzing) return;

    setAnalyzing(true);

    const formData = new FormData();
    formData.append("resume", resumeFile);

    try {
      const result = await api.post("/interview/resume", formData, {
        withCredentials: true,
      });

      setRole(result.data.role || "");
      setExperience(getExperienceYears(result.data.experience));
      setSkills(result.data.skills || []);
      setProjects(result.data.projects || []);
      setResumeText(result.data.resumeText || "");

      setAnalysisDone(true);
      setAnalyzing(false);
    } catch (error) {
      console.error("Resume analysis error:", error);
      setAnalyzing(false);
    }
  };

  const handleStartInterview = async () => {

    setLoading(true);
    try {
      const result = await api.post("/interview/generate-questions", {
        role,
        experience,
        mode,
        resumeText,
        projects,
        skills,
      }, {withCredentials: true})

      if(userData){
        dispatch(setUserData({...userData, credits: result.data.creditsLeft}));
      }

      setLoading(false);
      onStart(result.data);

    } catch (error) {
      console.error("Question generation error:", error);
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="flex items-center justify-center bg-slate-950 text-white"
    >
      <div className="w-full max-w-7xl grid md:grid-cols-2 overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] backdrop-blur-sm shadow-2xl">
        {/* Left side */}

        <motion.div
          initial={{ x: -60, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{
            duration: 0.7,
            ease: "easeOut",
          }}
          className="relative p-8 md:p-10 flex flex-col justify-center bg-gradient-to-br from-cyan-500/[0.08] to-teal-500/[0.03]"
        >
          <h2 className="text-2xl md:text-3xl font-bold leading-tight mb-5">
            Start Your <span className="gradient-text">AI Interview</span>
          </h2>

          <p className="text-slate-400 leading-relaxed text-sm">
            Practice realistic interview scenarios with AI-powered questions,
            personalized follow-ups, and detailed performance feedback.
          </p>

          <div className="w-full max-w-sm space-y-5 mt-7 pl-4">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{
                  opacity: 0,
                  y: 25,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  delay: 0.3 + index * 0.12,
                  duration: 0.5,
                  ease: "easeOut",
                }}
                whileHover={{
                  scale: 1.02,
                  x: 2,
                }}
                className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.04] backdrop-blur-sm p-3 hover:border-cyan-400/30 hover:bg-white/[0.06] transition-all duration-300 cursor-pointer"
              >
                {feature.icon}

                <span className="text-sm">{feature.text}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Right side*/}

        <motion.div
          initial={{ x: 60, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{
            duration: 0.7,
            ease: "easeOut",
          }}
          className="p-8 md:p-10 bg-white/[0.02]"
        >
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
            Prepare Your Interview
          </h2>

          <p className="text-slate-400 text-sm">
            Set your preferences and start practicing.
          </p>

          <div className="space-y-4 mt-8 w-full md:w-4/5">
            {/* role */}

            <div className="flex items-center rounded-xl border border-white/10 bg-white/[0.04] backdrop-blur-sm px-4 py-3 transition-all duration-300 focus-within:border-cyan-400/40 focus-within:bg-white/[0.06] focus-within:ring-2 focus-within:ring-cyan-400/10">
              <FaUserTie className="text-cyan-400 text-lg mr-3 shrink-0" />

              <input
                type="text"
                placeholder="Enter Your Role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full bg-transparent text-sm text-white placeholder:text-slate-500 outline-none"
              />
            </div>

            {/* experience */}

            <div className="flex items-center rounded-xl border border-white/10 bg-white/[0.04] backdrop-blur-sm px-4 py-3 transition-all duration-300 focus-within:border-cyan-400/40 focus-within:bg-white/[0.06] focus-within:ring-2 focus-within:ring-cyan-400/10">
              <FaBriefcase className="text-cyan-400 text-lg mr-3 shrink-0" />

              <input
                type="text"
                placeholder="Experience (e.g. 2 years)"
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
                className="w-full bg-transparent text-sm text-white placeholder:text-slate-500 outline-none"
              />
            </div>

            {/* mode */}

            <div className="flex items-center rounded-xl border border-white/10 bg-white/[0.04] backdrop-blur-sm px-4 py-3 transition-all duration-300 focus-within:border-cyan-400/40 focus-within:bg-white/[0.06] focus-within:ring-2 focus-within:ring-cyan-400/10">
              <HiSparkles className="text-cyan-400 text-lg mr-3 shrink-0" />

              <select
                value={mode}
                onChange={(e) => setMode(e.target.value)}
                className="w-full bg-transparent text-sm text-slate-300 outline-none cursor-pointer"
              >
                <option value="" className="bg-slate-900">
                  Select Interview Mode
                </option>

                <option value="Technical Interview" className="bg-slate-900">
                  Technical Interview
                </option>

                <option value="HR Interview" className="bg-slate-900">
                  HR Interview
                </option>
              </select>
            </div>

            {/* resume upload */}

            {!analysisDone && (
              <motion.div
                whileHover={{
                  scale: 1.01,
                }}
                transition={{
                  duration: 0.2,
                }}
                onClick={() => document.getElementById("resumeUpload")?.click()}
                className="group relative border-2 border-dashed border-white/10 rounded-2xl p-6 text-center cursor-pointer bg-white/[0.03] backdrop-blur-sm hover:border-cyan-400/40 hover:bg-cyan-400/[0.03] transition-all duration-300"
              >
                <div className="mx-auto mb-4 w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center group-hover:bg-cyan-500/15 transition-colors duration-300">
                  <FaFileUpload className="text-xl text-cyan-400" />
                </div>

                <input
                  type="file"
                  accept="application/pdf"
                  id="resumeUpload"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];

                    if (file) {
                      setResumeFile(file);
                    }
                  }}
                />

                <p className="text-sm font-medium text-slate-300 group-hover:text-white transition-colors">
                  {resumeFile
                    ? resumeFile.name
                    : "Upload Your Resume (max 5MB)"}
                </p>

                {resumeFile && (
                  <motion.button
                    type="button"
                    disabled={analyzing}
                    whileHover={{
                      scale: analyzing ? 1 : 1.02,
                    }}
                    whileTap={{
                      scale: analyzing ? 1 : 0.97,
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleUploadResume();
                    }}
                    className="mt-4 px-5 py-2 rounded-lg bg-cyan-500/10 border border-cyan-400/20 text-cyan-300 text-xs font-medium hover:bg-cyan-500/20 hover:border-cyan-400/40 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {analyzing ? "Analyzing..." : "Analyze Resume"}
                  </motion.button>
                )}
              </motion.div>
            )}

            {/* Resume analysis result */}
            {analysisDone && (
              <motion.div
                initial={{
                  opacity: 0,
                  y: 12,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  duration: 0.35,
                  ease: "easeOut",
                }}
                className="rounded-2xl border border-cyan-400/15 bg-white/[0.035] backdrop-blur-sm p-4 text-left"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-cyan-400/10 border border-cyan-400/15 flex items-center justify-center">
                    <FaFileUpload className="text-cyan-400 text-xs" />
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold text-white">
                      Resume Analysis Result
                    </h3>

                    <p className="text-[11px] text-slate-500">
                      Resume analyzed successfully
                    </p>
                  </div>
                </div>

                {/* Projects */}

                {projects.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-xs font-semibold text-slate-300 mb-2">
                      Projects
                    </h4>

                    <div className="rounded-xl border border-white/10 bg-white/[0.025] px-3 py-2.5">
                      <ul className="list-disc list-outside pl-5 space-y-1">
                        {projects.slice(0, 4).map((project, i) => (
                          <motion.li
                            key={i}
                            initial={{
                              opacity: 0,
                              x: -5,
                            }}
                            animate={{
                              opacity: 1,
                              x: 0,
                            }}
                            transition={{
                              delay: i * 0.04,
                              duration: 0.25,
                            }}
                            className="text-xs text-slate-300 leading-5 pl-1 text-left line-clamp-1"
                          >
                            {String(project).trim()}
                          </motion.li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}

                {/* Skills */}

                {skills.length > 0 && (
                  <div>
                    <h4 className="text-xs font-semibold text-slate-300 mb-2">
                      Skills
                    </h4>

                    <div className="rounded-xl border border-white/10 bg-white/[0.025] px-3 py-2.5">
                      <ul className="grid grid-cols-2 gap-x-5 gap-y-1">
                        {skills.slice(0, 12).map((skill, i) => (
                          <motion.li
                            key={i}
                            initial={{
                              opacity: 0,
                            }}
                            animate={{
                              opacity: 1,
                            }}
                            transition={{
                              delay: i * 0.03,
                              duration: 0.25,
                            }}
                            className="flex items-center gap-2 text-xs text-slate-300 min-w-0"
                          >
                            {/* Bullet */}

                            <span className="w-1 h-1 rounded-full bg-cyan-400 shrink-0" />

                            {/* Skill */}

                            <span className="truncate">
                              {String(skill).trim()}
                            </span>
                          </motion.li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            <motion.button
              disabled={!role || !experience || loading}
              type="button"
              onClick={handleStartInterview}
              whileHover={
                role && experience
                  ? {
                      scale: 1.015,
                      boxShadow: "0 8px 25px rgba(34, 211, 238, 0.18)",
                    }
                  : {}
              }
              whileTap={
                role && experience
                  ? {
                      scale: 0.98,
                    }
                  : {}
              }
              transition={{
                duration: 0.2,
                ease: "easeOut",
              }}
              className={`w-full mt-6 py-3 rounded-xl font-semibold text-sm transition-all duration-300 ${
                role && experience
                  ? "bg-gradient-to-r from-cyan-500 to-teal-500 text-white cursor-pointer"
                  : "bg-white/[0.06] text-slate-500 cursor-not-allowed border border-white/10"
              }`}
            >
              {loading ? "Starting..." : "Start Interview"}
            </motion.button>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Step1Setup;
