import { motion } from "framer-motion";
import { buildStyles, CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const Step3Report = ({ report }) => {
  if (!report) {
    return (
      <div className="flex min-h-[300px] items-center justify-center">
        <p className="text-sm text-slate-400">Loading Report...</p>
      </div>
    );
  }

  const {
    finalScore = 0,
    confidence = 0,
    communication = 0,
    correctness = 0,
    questionWiseScores = [],
  } = report;

  const questionScoreData = questionWiseScores.map((question, index) => {
    const value = Number(question.score) || 0;

    return {
      name: `Q${index + 1}`,
      score: Math.min(Math.max(value, 0), 10),
      isZero: value === 0,
    };
  });

  const skills = [
    {
      label: "Confidence",
      value: confidence,
    },
    {
      label: "Communication",
      value: communication,
    },
    {
      label: "Correctness",
      value: correctness,
    },
  ];

  let performanceText = "";
  let shortTagline = "";

  if (finalScore >= 8) {
    performanceText = "Ready for job opportunities.";
    shortTagline = "Excellent clarity and structured response.";
  } else if (finalScore >= 5) {
    performanceText = "Needs minor improvement before interviews.";
    shortTagline = "Good foundation, refine articulation.";
  } else {
    performanceText = "Significant improvement required.";
    shortTagline = "Work on clarity and confidence.";
  }

  const score = Number(finalScore) || 0;

  const percentage = Math.min(Math.max((score / 10) * 100, 0), 100);

  //pdf download
  const downloadPDF = () => {
    const doc = new jsPDF("p", "mm", "a4");

    const pageWidth = doc.internal.pageSize.getWidth();

    const pageHeight = doc.internal.pageSize.getHeight();

    const margin = 16;

    const contentWidth = pageWidth - margin * 2;

    let currentY = 20;

    const cyan = [6, 182, 212];
    const dark = [15, 23, 42];
    const text = [51, 65, 85];
    const muted = [100, 116, 139];
    const lightBg = [248, 250, 252];
    const border = [226, 232, 240];
    const green = [16, 185, 129];

    //title
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.setTextColor(...cyan);

    doc.text("INTELLIPREP.AI", margin, currentY - 7);

    doc.setFontSize(14);
    doc.setTextColor(...dark);

    doc.text("INTERVIEW PERFORMANCE REPORT", margin, currentY + 5);

    currentY += 7;

    doc.setDrawColor(...cyan);
    doc.line(margin, currentY, pageWidth - margin, currentY);

    currentY += 9;

    //score
    doc.setFillColor(...lightBg);
    doc.setDrawColor(...border);

    doc.roundedRect(margin, currentY, contentWidth, 38, 4, 4, "FD");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(...cyan);

    doc.text("OVERALL PERFORMANCE", margin + 6, currentY + 7);

    const centerX = margin + contentWidth / 2;

    doc.setFontSize(13);
    doc.setTextColor(...cyan);

    doc.text(`${score}/10`, centerX, currentY + 19, {
      align: "center",
    });

    doc.setFontSize(9);
    doc.setTextColor(...dark);

    doc.text(performanceText, centerX, currentY + 26, {
      align: "center",
    });

    doc.setFontSize(8);
    doc.setTextColor(...muted);

    doc.text(shortTagline, centerX, currentY + 32, {
      align: "center",
      maxWidth: contentWidth - 12,
    });

    currentY += 45;

    // skills
    doc.setFillColor(...lightBg);
    doc.setDrawColor(...border);
    doc.roundedRect(margin, currentY, contentWidth, 42, 4, 4, "FD");

    doc.setFont("helvetica", "bold");

    doc.setFontSize(12);

    doc.setTextColor(31, 41, 55);

    doc.text("Skill Evaluation", margin + 10, currentY + 9);

    doc.setFont("helvetica", "normal");

    doc.setFontSize(10);

    doc.text(`Confidence: ${confidence}/10`, margin + 10, currentY + 19);

    doc.text(`Communication: ${communication}/10`, margin + 10, currentY + 27);

    doc.text(`Correctness: ${correctness}/10`, margin + 10, currentY + 35);

    currentY += 49;

    // advice
    const advice =
      score >= 8
        ? "Excellent performance. Maintain confidence and structure. Continue refining clarity and supporting answers with real-world examples."
        : score >= 5
          ? "Good foundation shown. Improve clarity and structure. Practice delivering concise, confident answers with supporting examples."
          : "Significant improvement required. Focus on refining clarity, structure, and confidence. Practice delivering concise, confident answers with supporting examples.";

    const splitAdvice = doc.splitTextToSize(advice, contentWidth - 20);

    const adviceLineHeight = 5;

    const adviceHeight = Math.max(
      32,
      splitAdvice.length * adviceLineHeight + 20,
    );

    doc.setFillColor(...lightBg);

    doc.setDrawColor(...border);

    doc.roundedRect(margin, currentY, contentWidth, adviceHeight, 4, 4, "FD");

    doc.setFont("helvetica", "bold");

    doc.setFontSize(12);

    doc.setTextColor(15, 23, 42);

    doc.text("Performance Advice", margin + 10, currentY + 10);

    doc.setFont("helvetica", "normal");

    doc.setFontSize(10);

    doc.setTextColor(71, 85, 105);

    doc.text(splitAdvice, margin + 10, currentY + 18);

    currentY += adviceHeight + 12;

    // questions
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(...dark);

    doc.text("QUESTION SCORES", margin, currentY);

    currentY += 4;

    doc.setDrawColor(...cyan);

    doc.line(margin, currentY, pageWidth - margin, currentY);

    currentY += 3;

    const compactQuestions = questionWiseScores.map((question, index) => {
      const questionText = question.question
        ? doc.splitTextToSize(question.question, 72).slice(0, 2).join(" ")
        : "Question not available.";

      const feedback =
        question.feedback && question.feedback.trim() !== ""
          ? question.feedback
          : "No feedback available.";

      const feedbackText = doc
        .splitTextToSize(feedback, 70)
        .slice(0, 2)
        .join(" ");

      return [
        `Q${index + 1}`,
        questionText,
        `${question.score ?? 0}/10`,
        feedbackText,
      ];
    });

    autoTable(doc, {
      startY: currentY,

      margin: {
        left: margin,
        right: margin,
      },

      tableWidth: contentWidth,

      head: [["QUESTION", "QUESTION", "SCORE", "AI FEEDBACK"]],

      body: compactQuestions,

      theme: "grid",

      styles: {
        font: "helvetica",
        fontSize: 10,
        cellPadding: 2.2,
        valign: "middle",
        textColor: text,
        lineColor: border,
        lineWidth: 0.2,
      },

      headStyles: {
        fillColor: dark,
        textColor: [255, 255, 255],
        fontStyle: "bold",
        fontSize: 9,
        cellPadding: 2.5,
        halign: "center",
      },

      columnStyles: {
        0: {
          cellWidth: 16,
          halign: "center",
          fontStyle: "bold",
          textColor: cyan,
        },

        1: {
          cellWidth: 72,
        },

        2: {
          cellWidth: 22,
          halign: "center",
          fontStyle: "bold",
          textColor: dark,
        },

        3: {
          cellWidth: "auto",
        },
      },

      alternateRowStyles: {
        fillColor: [252, 253, 255],
      },

      didParseCell: (data) => {
        if (data.section === "body" && data.column.index === 2) {
          const rawScore = Number(String(data.cell.raw).split("/")[0]);

          if (rawScore === 0) {
            data.cell.styles.textColor = [239, 68, 68];
          } else if (rawScore < 5) {
            data.cell.styles.textColor = [245, 158, 11];
          } else {
            data.cell.styles.textColor = green;
          }
        }
      },

      didDrawPage: () => {
        const footerY = pageHeight - 7;

        doc.setFont("helvetica", "normal");
        doc.setFontSize(7);
        doc.setTextColor(148, 163, 184);

        doc.text(
          "INTELLIPREP.AI • INTERVIEW PERFORMANCE REPORT",
          margin,
          footerY,
        );

        doc.text(
          `Page ${doc.internal.getNumberOfPages()}`,
          pageWidth - margin,
          footerY,
          { align: "right" },
        );
      },
    });

    doc.save("AI_Interview_Report.pdf");
  };

  return (
    <div className="w-full px-3 py-4 sm:px-5 lg:px-6">
      <div className="mx-auto w-full max-w-6xl">
        {/* header */}
        <motion.div
          initial={{
            opacity: 0,
            y: -12,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.45,
            ease: "easeOut",
          }}
          className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
        >
          <div>
            <h1 className="gradient-text text-2xl font-bold sm:text-3xl">
              Your Interview Analysis
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              AI powered performance insights
            </p>
          </div>

          <button
            onClick={downloadPDF}
            className="w-full rounded-xl border border-cyan-400/20 bg-cyan-400/10 px-5 py-2.5 text-sm font-semibold text-cyan-400 transition-all duration-300 hover:border-cyan-400/40 hover:bg-cyan-400/15 hover:shadow-lg hover:shadow-cyan-500/5 sm:w-auto"
          >
            Download Report
          </button>
        </motion.div>

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
          {/* left section */}
          <div className="space-y-5 lg:col-span-5">
            {/* score card  */}
            <motion.div
              initial={{
                opacity: 0,
                y: 15,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 0.4,
              }}
              className="rounded-2xl border border-white/10 bg-white/[0.025] p-5 shadow-lg shadow-black/5 transition-all duration-300 hover:border-cyan-400/20 sm:p-6"
            >
              <div className="flex flex-col items-center text-center">
                <div className="mb-5 w-full text-left">
                  <p className="text-sm font-semibold text-slate-200">
                    Overall Performance
                  </p>

                  <div className="mt-2 h-px w-full bg-white/10" />
                </div>

                <div className="h-24 w-24 sm:h-28 sm:w-28">
                  <CircularProgressbar
                    value={percentage}
                    text={`${score}/10`}
                    styles={buildStyles({
                      textSize: "18px",
                      pathColor: "#06b6d4",
                      textColor: "#e2e8f0",
                      trailColor: "#1e293b",
                      pathTransitionDuration: 1,
                    })}
                  />
                </div>

                <div className="mt-5">
                  <p className="text-base font-semibold text-slate-200 sm:text-lg">
                    {performanceText}
                  </p>

                  <p className="mt-1 text-sm text-slate-500">{shortTagline}</p>
                </div>
              </div>
            </motion.div>

            {/* skills */}

            <motion.div
              initial={{
                opacity: 0,
                y: 15,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 0.4,
                delay: 0.1,
              }}
              className="rounded-2xl border border-white/10 bg-white/[0.025] p-5 shadow-lg shadow-black/5 transition-all duration-300 hover:border-cyan-400/20 sm:p-6"
            >
              <div className="mb-5">
                <h3 className="text-base font-semibold text-slate-200">
                  Skill Evaluation
                </h3>

                <p className="mt-1 text-xs text-slate-500">
                  Breakdown of your interview performance.
                </p>

                <div className="mt-4 h-px w-full bg-white/10" />
              </div>

              <div className="space-y-5">
                {skills.map((skill, index) => (
                  <div key={index}>
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-sm font-medium text-slate-400">
                        {skill.label}
                      </span>

                      <span className="text-sm font-semibold text-cyan-400">
                        {skill.value}/10
                      </span>
                    </div>

                    <div className="h-2 overflow-hidden rounded-full bg-slate-800">
                      <motion.div
                        initial={{
                          width: 0,
                        }}
                        animate={{
                          width: `${Math.min(skill.value * 10, 100)}%`,
                        }}
                        transition={{
                          duration: 0.8,
                          delay: index * 0.1,
                          ease: "easeOut",
                        }}
                        className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-teal-400"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* right section */}

          <div className="space-y-5 lg:col-span-7">
            {/* chart */}

            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.15 }}
              className="group rounded-2xl border border-white/10 bg-white/[0.025] p-5 shadow-lg shadow-black/5 transition-all duration-300 hover:border-cyan-400/20 sm:p-6"
            >
              <div className="mb-5 flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.7)]" />

                    <h3 className="text-base font-semibold text-slate-200">
                      Performance Trend
                    </h3>
                  </div>

                  <p className="mt-1.5 text-xs text-slate-500">
                    Individual scores across your interview questions.
                  </p>
                </div>

                <div className="rounded-lg border border-cyan-400/10 bg-cyan-400/[0.05] px-2.5 py-1.5">
                  <span className="text-xs font-semibold uppercase tracking-wider text-cyan-400">
                    {score}/10
                  </span>
                </div>
              </div>

              <div className="mb-4 h-px w-full bg-gradient-to-r from-white/10 via-white/5 to-transparent" />

              <div className="h-56 w-full sm:h-64">
                {questionScoreData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={questionScoreData}
                      margin={{
                        top: 15,
                        right: 12,
                        left: -18,
                        bottom: 5,
                      }}
                    >
                      <defs>
                        <linearGradient
                          id="performanceAreaGradient"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="0%"
                            stopColor="#22d3ee"
                            stopOpacity={0.28}
                          />

                          <stop
                            offset="55%"
                            stopColor="#06b6d4"
                            stopOpacity={0.1}
                          />

                          <stop
                            offset="100%"
                            stopColor="#06b6d4"
                            stopOpacity={0}
                          />
                        </linearGradient>
                      </defs>

                      <CartesianGrid
                        stroke="#1e293b"
                        strokeDasharray="3 7"
                        vertical={false}
                      />

                      <XAxis
                        dataKey="name"
                        tick={{
                          fontSize: 10,
                          fill: "#64748b",
                        }}
                        tickLine={false}
                        axisLine={false}
                        dy={8}
                      />

                      <YAxis
                        domain={[0, 10]}
                        ticks={[0, 2, 4, 6, 8, 10]}
                        tick={{
                          fontSize: 10,
                          fill: "#64748b",
                        }}
                        tickLine={false}
                        axisLine={false}
                        dx={-4}
                      />

                      <Tooltip
                        cursor={{
                          stroke: "#22d3ee",
                          strokeWidth: 1,
                          strokeDasharray: "4 5",
                          opacity: 0.5,
                        }}
                        contentStyle={{
                          background: "#0f172a",
                          border: "1px solid rgba(34, 211, 238, 0.2)",
                          borderRadius: "12px",
                          padding: "10px 12px",
                          boxShadow: "0 12px 35px rgba(0, 0, 0, 0.35)",
                        }}
                        labelStyle={{
                          color: "#22d3ee",
                          fontSize: "11px",
                          fontWeight: 600,
                          marginBottom: "4px",
                        }}
                        itemStyle={{
                          color: "#e2e8f0",
                          fontSize: "12px",
                          fontWeight: 500,
                        }}
                        formatter={(value) => [`${value}/10`, "Question Score"]}
                      />

                      <Area
                        type="monotone"
                        dataKey="score"
                        stroke="#22d3ee"
                        strokeWidth={2.5}
                        fill="url(#performanceAreaGradient)"
                        fillOpacity={1}
                        activeDot={{
                          r: 6,
                          fill: "#22d3ee",
                          stroke: "#cffafe",
                          strokeWidth: 2,
                        }}
                        dot={({ cx, cy, payload }) => (
                          <circle
                            cx={cx}
                            cy={cy}
                            r={4}
                            fill={payload.isZero ? "#ef4444" : "#0f172a"}
                            stroke={payload.isZero ? "#ef4444" : "#22d3ee"}
                            strokeWidth={2}
                          />
                        )}
                        animationDuration={1000}
                        animationEasing="ease-out"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex h-full items-center justify-center rounded-xl border border-dashed border-white/10">
                    <p className="text-sm text-slate-500">
                      No performance data available.
                    </p>
                  </div>
                )}
              </div>

              <div className="mt-4 flex items-center justify-between border-t border-white/5 pt-3">
                <span className="text-[10px] uppercase tracking-wider text-slate-600">
                  Individual Questions
                </span>

                <span className="text-xs font-medium text-slate-500">
                  {questionScoreData.length}{" "}
                  {questionScoreData.length === 1 ? "question" : "questions"}
                </span>
              </div>
            </motion.div>

            {/* questions*/}

            <motion.div
              initial={{
                opacity: 0,
                y: 15,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 0.4,
                delay: 0.2,
              }}
              className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.025] shadow-lg shadow-black/5 transition-all duration-300 hover:border-cyan-400/20"
            >
              <div className="border-b border-white/10 px-5 py-4 sm:px-6">
                <h3 className="text-base font-semibold text-slate-200">
                  Question Breakdown
                </h3>

                <p className="mt-1 text-xs text-slate-500">
                  Review your score and feedback for each question.
                </p>
              </div>

              <div>
                {questionWiseScores.length > 0 ? (
                  questionWiseScores.map((question, index) => (
                    <motion.div
                      key={index}
                      initial={{
                        opacity: 0,
                        y: 8,
                      }}
                      animate={{
                        opacity: 1,
                        y: 0,
                      }}
                      transition={{
                        duration: 0.3,
                        delay: index * 0.05,
                      }}
                      className="border-b border-white/10 p-5 last:border-b-0 sm:p-6"
                    >
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                        <div className="min-w-0 flex-1">
                          <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.15em] text-cyan-400">
                            Question {index + 1}
                          </p>

                          <p className="text-sm font-medium leading-6 text-slate-300 sm:text-[15px]">
                            {question.question || "Question not available."}
                          </p>
                        </div>

                        <div className="w-fit shrink-0 rounded-xl border border-cyan-400/20 bg-cyan-400/10 px-3 py-1.5">
                          <span className="text-sm font-bold text-cyan-400">
                            {question.score ?? 0}/10
                          </span>
                        </div>
                      </div>

                      <div className="mt-4 rounded-xl border border-emerald-400/10 bg-emerald-400/[0.04] px-4 py-3.5">
                        <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.15em] text-emerald-400">
                          AI Feedback
                        </p>

                        <p className="text-sm leading-6 text-slate-400">
                          {question.feedback && question.feedback.trim() !== ""
                            ? question.feedback
                            : "No feedback available for this question."}
                        </p>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="px-5 py-10 text-center">
                    <p className="text-sm text-slate-500">
                      No question breakdown available.
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Step3Report;
