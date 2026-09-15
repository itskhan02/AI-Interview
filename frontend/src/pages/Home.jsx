import { useCallback, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import {
  HiArrowRight,
  HiChartBar,
  HiDocumentText,
  HiMicrophone,
  HiSparkles,
} from "react-icons/hi2";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Features from "../components/Features";
import AuthModel from "../components/AuthModel";

const loggedInActions = [
  {
    title: "Start an interview",
    description: "Practice role-specific questions with live AI feedback.",
    to: "/interview",
    icon: HiMicrophone,
  },
  {
    title: "Analyze resume",
    description: "Get ATS gaps, keyword fixes, and recruiter-ready edits.",
    to: "/resume-analyzer",
    icon: HiDocumentText,
  },
  {
    title: "View analytics",
    description: "Track confidence, clarity, pacing, and readiness trends.",
    to: "/analytics",
    icon: HiChartBar,
  },
];

const plans = [
  {
    id: "free",
    name: "Starter",
    price: "Free",
    credits: 100,
    popular: false,
  },
  {
    id: "standard",
    name: "Standard",
    price: "₹599",
    period: "/month",
    credits: 500,
    popular: true,
  },
  {
    id: "pro",
    name: "Pro",
    price: "₹999",
    period: "/month",
    credits: 1200,
    popular: false,
  },
];

const Home = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { userData } = useSelector((state) => state.user);
  const isAuthenticated = Boolean(userData || localStorage.getItem("token"));
  const [showAuth, setShowAuth] = useState(false);

  useEffect(() => {
    if (!location.hash) return;

    const id = location.hash.replace("#", "");
    window.setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    }, 80);
  }, [location.hash]);

  const navigateWithAuth = useCallback(
    (path) => {
      if (isAuthenticated) {
        navigate(path);
      } else {
        setShowAuth(true);
      }
    },
    [isAuthenticated, navigate],
  );

  const handlePlan = (plan) => {
    if (!isAuthenticated) {
      setShowAuth(true);
      return;
    }

    if (plan.id === "free") {
      navigate("/interview");
      return;
    }

    navigate("/buy-credits", {
      state: {
        plan: {
          id: plan.id,
          name: plan.name,
          price: plan.price,
          credits: plan.credits,
          period: plan.period,
        },
      },
    });
  };

  const handleStart = () => {
    if (userData) {
      navigate("/interview");
    } else {
      setShowAuth(true);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950 text-white ">
      <div className="pointer-events-none absolute inset-0 opacity-40" />

      <Navbar openAuth={() => setShowAuth(true)} />

      <motion.main
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative"
      >
        <section id="about" className="relative px-6 pt-32 pb-20 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="max-w-5xl mx-auto"
          >
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55 }}
              className="inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-2 text-sm font-medium text-cyan-100 mb-6"
            >
              <HiSparkles className="text-cyan-300" />
              {isAuthenticated
                ? `Welcome back${userData?.name ? `, ${userData.name.split(" ")[0]}` : ""}`
                : "AI interview prep built for serious candidates"}
            </motion.div>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-[1.05]">
              Ace Your Interviews <br />
              <span className="gradient-text">with AI</span>
            </h1>
            <p className="mt-6 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              Practice technical, HR, and behavioral interviews with your
              personal AI interview coach. Real-time feedback. Real results.
            </p>
            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <button
                type="button"
                onClick={handleStart}
                className="group inline-flex items-center gap-2 px-7 py-3.5 rounded-2xl gradient-primary text-white font-semibold shadow-[0_0_40px_oklch(0.68_0.12_188.58/0.53)] hover:shadow-[0_0_55px_oklch(0.68_0.12_188.58/0.7)] hover:scale-[1.02] transition-all duration-300"
              >
                {isAuthenticated ? "Start practice" : "Start preparing"}
                <HiArrowRight className="transition group-hover:translate-x-1" />
              </button>
            </div>
            <div className="mt-24">
              <div className="grid lg:grid-cols-2 gap-16 items-center">
                <div className="text-center lg:text-left">
                  <p className="text-base font-semibold uppercase text-cyan-300 mb-4">
                    About IntelliPrep
                  </p>
                  <h2 className="text-4xl md:text-5xl font-bold leading-tight">
                    Built around the way strong candidates actually improve.
                  </h2>
                </div>
                <div className="flex items-center">
                  <p className="text-lg leading-9 text-slate-300 text-center lg:text-left">
                    IntelliPrep combines mock interviews, resume analysis, and
                    performance analytics into one focused prep workflow. Guests
                    get a clear path to start, while signed-in users land
                    directly on the actions that move their preparation forward.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        {isAuthenticated && (
          <section className="mx-auto max-w-6xl px-6 pb-16">
            <div className="grid gap-4 md:grid-cols-3">
              {loggedInActions.map((action) => (
                <button
                  key={action.to}
                  type="button"
                  onClick={() => navigateWithAuth(action.to)}
                  className="group rounded-2xl border border-white/10 bg-white/[0.05] p-5 text-left transition hover:-translate-y-1 hover:border-cyan-300/30 hover:bg-white/[0.08] focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300"
                >
                  <action.icon className="h-6 w-6 text-cyan-300" />
                  <h2 className="mt-4 text-lg font-bold">{action.title}</h2>
                  <p className="mt-2 text-sm leading-6 text-slate-400">
                    {action.description}
                  </p>
                </button>
              ))}
            </div>
          </section>
        )}

        <section id="features" className="mx-auto max-w-6xl px-6 py-20">
          <Features />
        </section>

        <section id="pricing" className="mx-auto max-w-6xl px-6 py-12">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
              Pick the prep intensity that <br />
              <span className="gradient-text">fits your search</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Choose the perfect plan to accelerate your interview preparation
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {plans.map((plan, index) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className={`relative rounded-2xl transition-all duration-300 hover:-translate-y-1 ${
                  plan.popular
                    ? "border-2 border-cyan-500/50 bg-gradient-to-b from-cyan-500/10 to-transparent"
                    : "border border-white/10 bg-white/[0.05]"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="bg-gradient-to-r from-cyan-500 to-teal-500 text-white text-xs font-medium px-3 py-1 rounded-full">
                      Popular
                    </span>
                  </div>
                )}

                <div className="p-6 text-center">
                  <h3 className="text-xl font-bold mb-3">{plan.name}</h3>

                  <div className="mb-4">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    {plan.period && (
                      <span className="text-sm text-muted-foreground">
                        {plan.period}
                      </span>
                    )}
                  </div>

                  <div className="mb-6 p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/20">
                    <div className="text-sm text-cyan-300 mb-1">
                      Credits per month
                    </div>
                    <div className="text-2xl font-bold text-cyan-300">
                      {plan.credits}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handlePlan(plan)}
                    className={`w-full rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-300 ${
                      plan.popular
                        ? "bg-gradient-to-r from-cyan-500 to-teal-500 text-white hover:shadow-lg hover:shadow-cyan-500/20"
                        : "border border-white/10 bg-white/[0.04] text-slate-300 hover:border-cyan-400/30 hover:bg-cyan-400/10 hover:text-cyan-300"
                    }`}
                  >
                    {plan.id === "free" ? "Get Started" : "Choose Plan"}
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            viewport={{ once: true }}
            className="text-center mt-8"
          >
            <p className="text-sm text-slate-400">
              Secure payment • Cancel anytime • 14-day money-back guarantee
            </p>
          </motion.div>
        </section>
      </motion.main>

      <Footer />

      <AnimatePresence>
        {showAuth && <AuthModel onClose={() => setShowAuth(false)} />}
      </AnimatePresence>
    </div>
  );
};

export default Home;
