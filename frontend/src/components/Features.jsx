import {
  HiMicrophone,
  HiDocumentText,
  HiCodeBracket,
  HiUserGroup,
  HiChartBar,
  HiSparkles,
} from "react-icons/hi2";
import { motion } from "framer-motion";

const workflow = [
  {
    step: "STEP 1",
    title: "Choose Your Target Role",
    desc: "Select role, experience level, and interview type.",
    icon: HiUserGroup,
  },
  {
    step: "STEP 2",
    title: "AI Conducts Interview",
    desc: "Dynamic questions and follow-up questions based on your answers.",
    icon: HiMicrophone,
  },
  {
    step: "STEP 3",
    title: "Get Instant Feedback",
    desc: "Detailed performance analysis with actionable improvements.",
    icon: HiChartBar,
  },
];

const features = [
  {
    title: "AI Answer Evaluation",
    desc: "Analyze communication, confidence, technical accuracy, and answer relevance.",
    icon: HiChartBar,
  },
  {
    title: "Resume-Based Interviews",
    desc: "Generate personalized interview questions directly from your uploaded resume.",
    icon: HiDocumentText,
  },
  {
    title: "Detailed Performance Reports",
    desc: "Download comprehensive reports highlighting strengths and improvement areas.",
    icon: HiDocumentText,
  },
  {
    title: "Progress Tracking & Analytics",
    desc: "Track your interview performance and monitor improvement over time.",
    icon: HiChartBar,
  },
  {
    title: "Company-Specific Preparation",
    desc: "Practice interview patterns used by Google, Amazon, Microsoft, and top startups.",
    icon: HiSparkles,
  },
  {
    title: "Technical Interview Coaching",
    desc: "Master coding, problem-solving, and system design interviews with AI guidance.",
    icon: HiCodeBracket,
  },
];

const modes = [
  {
    title: "HR Interview Mode",
    desc: "Practice behavioral and communication-based questions designed to simulate real HR interviews.",
    icon: HiUserGroup,
  },
  {
    title: "Technical Mode",
    desc: "Practice deep technical questions tailored to your selected role, skills, and experience.",
    icon: HiCodeBracket,
  },
  {
    title: "Confidence Detection",
    desc: "Get insights into your communication, tone, and confidence to improve your interview delivery.",
    icon: HiSparkles,
  },
  {
    title: "Resume-Based Mode",
    desc: "Answer personalized questions generated from your resume, projects, skills, and experience.",
    icon: HiDocumentText,
  },
];

const Features = () => {
  return (
    <section className="relative">
      {/* Heading */}
      <div className="text-center mb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
            Everything you need to{" "}
            <span className="gradient-text">get hired</span>
          </h2>

          <p className="text-slate-400 mt-6 text-lg max-w-2xl mx-auto">
            An AI-powered toolkit designed to help you prepare smarter, perform
            better, and land your dream job.
          </p>
        </motion.div>
      </div>

      {/* Workflow */}
      <div className="grid md:grid-cols-3 gap-6 mb-24">
        {workflow.map((step, i) => (
          <motion.div
            key={step.title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{
              delay: i * 0.1,
              duration: 0.5,
            }}
            whileHover={{
              y: -6,
            }}
            className=" group relative rounded-3xl border border-white/10 bg-white/[0.04] backdrop-blur-sm p-8 text-center hover:border-cyan-400/20 transition-all duration-300"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            <div className="relative z-10">
              <div className="mx-auto mb-6 h-14 w-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
                <step.icon className="text-cyan-400 text-2xl" />
              </div>

              <p className="text-xs uppercase tracking-[0.2em] text-cyan-400 font-semibold">
                {step.step}
              </p>

              <h3 className="mt-3 text-xl font-semibold text-white">
                {step.title}
              </h3>

              <p className="mt-3 text-sm text-slate-400 leading-relaxed">
                {step.desc}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Capabilities Heading */}
      <div className="text-center mb-14">
        <h3 className="text-3xl md:text-4xl font-bold">
          Advanced AI <span className="gradient-text">Capabilities</span>
        </h3>

        <p className="text-slate-400 mt-4 max-w-2xl mx-auto">
          Powerful AI features designed to simulate real interviews and
          accelerate your preparation.
        </p>
      </div>

      {/* Feature Cards */}
      <div className="grid lg:grid-cols-2 gap-8 mb-24">
        {features.map((feature, i) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{
              delay: i * 0.08,
              duration: 0.5,
            }}
            whileHover={{
              y: -4,
            }}
            className=" group rounded-3xl border  border-white/10  bg-white/[0.04] backdrop-blur-sm p-8  hover:border-cyan-400/20  hover:bg-white/[0.06] transition-all duration-300 "
          >
            <div className="flex items-center gap-6">
              <div className=" h-16 w-16 rounded-2xl bg-gradient-to-br  from-cyan-500  to-teal-500 flex items-center justify-center shrink-0 shadow-lg group-hover:scale-105 transition-transform ">
                <feature.icon className="text-white text-3xl" />
              </div>

              <div>
                <h3 className="text-xl font-semibold text-white">
                  {feature.title}
                </h3>

                <p className="mt-2 text-slate-400 leading-relaxed">
                  {feature.desc}
                </p>

                <div className="mt-4 h-0.5 w-12 bg-gradient-to-r from-cyan-500 to-teal-500 rounded-full transition-all duration-300 group-hover:w-20" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Interview Modes Heading */}
      <div className="text-center mb-14">
        <h3 className="text-3xl md:text-4xl font-bold">
          Multiple Interview <span className="gradient-text">Modes</span>
        </h3>

        <p className="text-slate-400 mt-4 max-w-2xl mx-auto">
          Prepare for every stage of the interview with dedicated HR and
          technical modes, confidence insights, and flexible practice options.
        </p>
      </div>

      {/* Mode Cards */}
      <div className="grid lg:grid-cols-2 gap-8">
        {modes.map((mode, i) => (
          <motion.div
            key={mode.title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{
              delay: i * 0.08,
              duration: 0.5,
            }}
            whileHover={{
              y: -4,
            }}
            className=" group rounded-3xl border  border-white/10  bg-white/[0.04] backdrop-blur-sm p-8  hover:border-cyan-400/20  hover:bg-white/[0.06] transition-all duration-300 "
          >
            <div className="flex items-center gap-6">
              <div className=" h-16 w-16 rounded-2xl bg-gradient-to-br  from-cyan-500  to-teal-500 flex items-center justify-center shrink-0 shadow-lg group-hover:scale-105 transition-transform ">
                <mode.icon className="text-white text-3xl" />
              </div>

              <div>
                <h3 className="text-xl font-semibold text-white">
                  {mode.title}
                </h3>

                <p className="mt-2 text-slate-400 leading-relaxed">
                  {mode.desc}
                </p>

                <div className="mt-4 h-0.5 w-12 bg-gradient-to-r from-cyan-500 to-teal-500 rounded-full transition-all duration-300 group-hover:w-20" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default Features;
