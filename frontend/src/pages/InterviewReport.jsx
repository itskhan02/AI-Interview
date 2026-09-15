import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Step3Report from "../components/Step3Report";
import api from "../utils/api";
import { FaArrowLeft } from "react-icons/fa";

const InterviewReport = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        setLoading(true);

        const result = await api.get(`/interview/report/${id}`, {
          withCredentials: true,
        });

        setReport(result.data);
      } catch (error) {
        console.error("Error fetching interview report:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchReport();
    }
  }, [id]);

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen bg-slate-950 text-white flex items-center justify-center"
      >
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{
              duration: 1,
              repeat: Infinity,
              ease: "linear",
            }}
            className="mx-auto mb-4 h-10 w-10 rounded-full border-2 border-cyan-400/20 border-t-cyan-400"
          />

          <p className="text-sm text-slate-400">Loading interview report...</p>
        </div>
      </motion.div>
    );
  }

  if (!report) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="min-h-screen bg-slate-950 text-white flex items-center justify-center px-6"
      >
        <div className="w-full max-w-md rounded-2xl border border-white/10 bg-white/[0.025] p-8 text-center">
          <h2 className="text-xl font-semibold text-slate-200">
            Report Not Found
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            We couldn't find the interview report you're looking for.
          </p>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate("/history")}
            className="mt-6 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-500 px-5 py-2.5 text-sm font-semibold text-white transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/20"
          >
            Back to Interview History
          </motion.button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      className="min-h-screen bg-slate-950 text-white"
    >
      <div className="relative px-6 py-10">
        <div className="w-full max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="mb-6 flex items-center gap-4"
          >
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

            <div>
              <h1 className="text-2xl sm:text-3xl font-bold gradient-text">
                Interview Report
              </h1>

              <p className="mt-1 text-sm text-slate-500">
                Review your interview performance and feedback.
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.99 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{
              duration: 0.5,
              delay: 0.1,
              ease: "easeOut",
            }}
            className="rounded-3xl border border-white/10 bg-white/[0.02] p-4 sm:p-6"
          >
            <Step3Report report={report} />
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default InterviewReport;
