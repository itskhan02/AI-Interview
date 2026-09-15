import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import api from "../utils/api";
import Navbar from "../components/Navbar";
import {
  FaBriefcase,
  FaCalendarAlt,
  FaChartLine,
} from "react-icons/fa";

const InterviewHistory = () => {
  const [interviews, setInterviews] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const getMyInterviews = async () => {
      try {
        const result = await api.get("/interview/get-Interview", {
          withCredentials: true,
        });

        setInterviews(result.data);
      } catch (error) {
        console.error("Error fetching interviews:", error);
      }
    };

    getMyInterviews();
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Navbar />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="relative px-6 pt-24 pb-10"
      >
        <div className="w-full max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: "easeOut" }}
            className="mb-8"
          >
            <h1 className="text-2xl sm:text-3xl font-bold gradient-text">
              Interview History
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Track your past interviews and performance reports.
            </p>
          </motion.div>

          {interviews.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, ease: "easeOut" }}
              className="flex min-h-[280px] items-center justify-center rounded-2xl border border-white/10 bg-white/[0.025]"
            >
              <div className="text-center">
                <motion.div
                  initial={{ opacity: 0, scale: 0.85 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.35 }}
                  className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-cyan-400/20 bg-cyan-400/10"
                >
                  <FaChartLine className="text-xl text-cyan-400" />
                </motion.div>

                <h3 className="text-lg font-semibold text-slate-200">
                  No interviews found
                </h3>

                <p className="mt-2 text-sm text-slate-500">
                  Start your first interview to see your history here.
                </p>
              </div>
            </motion.div>
          ) : (
            <div className="space-y-4">
              {interviews.map((item, index) => (
                <motion.div
                  key={item._id || index}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.4,
                    delay: index * 0.08,
                    ease: "easeOut",
                  }}
                  whileHover={{ y: -2 }}
                  onClick={() => navigate(`/report/${item._id}`)}
                  className="group cursor-pointer rounded-2xl border border-white/10 bg-white/[0.025] p-5 transition-all duration-300 hover:border-cyan-400/25 hover:bg-white/[0.04] hover:shadow-lg hover:shadow-cyan-500/[0.03]"
                >
                  <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex min-w-0 items-center gap-4">
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.2 }}
                        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-cyan-400/20 bg-cyan-400/10"
                      >
                        <FaBriefcase className="text-cyan-400" />
                      </motion.div>

                      <div className="min-w-0">
                        <h3 className="truncate text-base font-semibold text-slate-200">
                          {item.role || "Interview"}
                        </h3>

                        <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-slate-500">
                          <span>
                            {item.experience || "Experience not specified"}
                          </span>

                          <span className="h-1 w-1 rounded-full bg-slate-600" />

                          <span className="flex items-center gap-1.5">
                            <FaCalendarAlt className="text-cyan-400/70" />
                            {new Date(item.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-6 sm:justify-end">
                      <div>
                        <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                          Overall Score
                        </p>

                        <p className="mt-1 text-xl font-bold text-cyan-400">
                          {item.finalScore || 0}
                          <span className="ml-1 text-base font-medium text-slate-500">
                            /10
                          </span>
                        </p>
                      </div>

                      <div className="flex items-center gap-3">
                        <span
                          className={`rounded-full border px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider ${
                            item.status === "Completed"
                              ? "border-emerald-400/20 bg-emerald-400/10 text-emerald-400"
                              : "border-red-400/20 bg-red-400/10 text-red-400"
                          }`}
                        >
                          {item.status}
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default InterviewHistory;
