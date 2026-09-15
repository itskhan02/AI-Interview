import { useState } from "react";
import { motion } from "framer-motion";
import { FaCheck, FaCoins, FaArrowRight } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import api from "../utils/api"
import { useDispatch } from "react-redux";
import { setUserData } from "../redux/userSlice";

const Pricing = () => {
  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState("free");
  const [loadingPlan, setLoadingPlan] = useState(null);
  const dispatch = useDispatch();

  const plans = [
    {
      id: "free",
      name: "Starter",
      price: "Free",
      credits: 100,
      period: "",
      description:
        "Perfect for beginners starting their interview preparation.",
      features: [
        "100 AI Interview Credits",
        "Basic Performance Report",
        "Voice Interview Access",
        "Limited History Tracking",
      ],
      popular: false,
      bestValue: false,
    },
    {
      id: "standard",
      name: "Standard",
      price: "399",
      credits: 500,
      period: "/ month",
      description:
        "Great for focused practice and continuous skill improvement.",
      features: [
        "500 AI Interview Credits",
        "Detailed Feedback",
        "Performance Analysis",
        "Full Interview History",
      ],
      popular: true,
      bestValue: false,
    },
    {
      id: "pro",
      name: "Pro",
      price: "699",
      credits: 1200,
      period: "/ month",
      description:
        "Complete preparation for serious job seekers who want to be interview-ready.",
      features: [
        "1200 AI Interview Credits",
        "Advanced AI Feedback",
        "Skill Trend Analysis",
        "Voice Interview Access",
        "Priority AI Processing",
      ],
      popular: false,
      bestValue: true,
    },
  ];

  const handleSelectPlan = (plan) => {
    setSelectedPlan(plan.id);
  };

  const handlePayment = async (plan) => {
    try {
      setLoadingPlan(plan.id);

      const amount = 
      plan.id === "standard" ? 399 :
      plan.id === "pro" ? 699 : 0;

      const result = await api.post("/payment/order", {
        planId: plan.id,
        amount: amount,
        credits: plan.credits,
      }, {
        withCredentials: true,
      });

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: result.data.amount,
        currency: "INR",
        name: "IntelliPrep.AI",
        description: `${plan.name} - ${plan.credits} Credits`,
        order_id: result.data.id,

        handler: async function (response) {
          try {
            const verifyPay = await api.post("/payment/verify", response, {
              withCredentials: true,
            });

            dispatch(setUserData(verifyPay.data.user));

            alert("Payment successful. Credits added to your account.");

            navigate("/");
          } catch (error) {
            console.error("Payment verification failed:", error);

            alert(
              error.response?.data?.message || "Payment verification failed.",
            );
          }
        },

        modal: {
          ondismiss: function () {
            setLoadingPlan(null);
          },
        },

        theme: {
          color: "#4ade80",
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();

      setLoadingPlan(null);
    } catch (error) {
      console.error("Payment order failed:", error);
      setLoadingPlan(null);
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Navbar />

      <main className="relative overflow-hidden px-5 pb-16 pt-28 sm:px-8">
        <div className="pointer-events-none absolute left-1/2 top-20 -z-0 h-72 w-72 -translate-x-1/2 rounded-full bg-cyan-500/10 blur-3xl" />

        <div className="relative z-10 mx-auto w-full max-w-6xl">
          <motion.div
            initial={{
              opacity: 0,
              y: -15,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.5,
            }}
            className="mx-auto mb-12 max-w-2xl text-center"
          >
            <div className="mb-4 inline-flex items-center rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1.5 text-xs font-medium text-cyan-300">
              Simple & transparent pricing
            </div>

            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
              Choose the right <span className="gradient-text">plan</span>
            </h1>

            <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-slate-500 sm:text-base">
              Get the interview practice, AI feedback, and performance insights
              you need to prepare with confidence.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 items-stretch gap-5 md:grid-cols-3">
            {plans.map((plan, index) => {
              const isSelected = selectedPlan === plan.id;

              return (
                <motion.div
                  key={plan.id}
                  initial={{
                    opacity: 0,
                    y: 20,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  transition={{
                    duration: 0.45,
                    delay: index * 0.1,
                    ease: "easeOut",
                  }}
                  whileHover={{
                    y: -4,
                  }}
                  onClick={() => handleSelectPlan(plan)}
                  className={`group relative flex h-full cursor-pointer flex-col rounded-2xl border transition-all duration-300 ${
                    isSelected
                      ? "border-cyan-400/40 bg-gradient-to-b from-cyan-400/[0.08] to-white/[0.025] shadow-xl shadow-cyan-500/[0.06]"
                      : "border-white/10 bg-white/[0.025] hover:border-cyan-400/20 hover:bg-white/[0.04]"
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 z-10 -translate-x-1/2">
                      <span className="whitespace-nowrap rounded-full border border-cyan-400/30 bg-slate-950 px-4 py-1.5 text-[10px] font-bold uppercase tracking-wider text-cyan-400 shadow-lg shadow-cyan-500/10">
                        Most Popular
                      </span>
                    </div>
                  )}

                  {plan.bestValue && (
                    <div className="absolute -top-3 left-1/2 z-10 -translate-x-1/2">
                      <span className="whitespace-nowrap rounded-full border border-emerald-400/30 bg-slate-950 px-4 py-1.5 text-[10px] font-bold uppercase tracking-wider text-emerald-400 shadow-lg shadow-emerald-500/10">
                        Best Value
                      </span>
                    </div>
                  )}

                  <div className="flex h-full flex-col p-6 sm:p-7">
                    <div>
                      <h2 className="text-xl font-bold text-slate-100">
                        {plan.name}
                      </h2>

                      <p className="mt-2 min-h-[48px] text-sm leading-6 text-slate-500">
                        {plan.description}
                      </p>
                    </div>

                    <div className="mt-7">
                      <div className="flex items-end">
                        <span className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
                          {plan.price === "Free" ? "₹0" : `₹${plan.price}`}
                        </span>

                        {plan.period && (
                          <span className="mb-1.5 ml-2 text-xs text-slate-500">
                            {plan.period}
                          </span>
                        )}
                      </div>
                    </div>

                    <div
                      className={`mt-6 rounded-xl border p-4 ${
                        isSelected
                          ? "border-cyan-400/20 bg-cyan-400/[0.08]"
                          : "border-white/10 bg-white/[0.025]"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-400/10">
                            <FaCoins className="text-sm text-cyan-400" />
                          </div>

                          <div>
                            <p className="text-xs font-medium text-slate-400">
                              AI Credits
                            </p>

                            <p className="text-[10px] text-slate-600">
                              {plan.id === "free"
                                ? "To get started"
                                : "Per month"}
                            </p>
                          </div>
                        </div>

                        <span className="text-2xl font-bold text-cyan-300">
                          {plan.credits}
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      disabled={loadingPlan === plan.id}
                      onClick={(e) => {
                        e.stopPropagation();

                        if (!isSelected) {
                          handleSelectPlan(plan);
                          return;
                        }

                        if (plan.id === "free") {
                          navigate("/interview");
                          return;
                        }

                        handlePayment(plan);
                        
                      }}
                      className={`group/btn mt-6 flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-300 ${
                        isSelected
                          ? "bg-gradient-to-r from-cyan-500 to-teal-500 text-white shadow-lg shadow-cyan-500/10 hover:shadow-xl hover:shadow-cyan-500/20"
                          : "border border-white/10 bg-white/[0.04] text-slate-300 hover:border-cyan-400/30 hover:bg-cyan-400/10 hover:text-cyan-300"
                      }`}
                    >
                      {loadingPlan === plan.id ? "Processing..." : isSelected
                        ? plan.id === "free"
                          ? "Current Plan"
                          : "Proceed to Pay"
                        : "Select Plan"}

                      <FaArrowRight className="text-xs transition-transform duration-300 group-hover/btn:translate-x-1" />
                    </button>

                    <div className="my-7 h-px bg-white/10" />

                    <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                      What's included
                    </p>

                    <div className="flex-1 space-y-3.5">
                      {plan.features.map((feature) => (
                        <div key={feature} className="flex items-start gap-3">
                          <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-cyan-400/10">
                            <FaCheck className="text-[9px] text-cyan-400" />
                          </div>

                          <span className="text-sm leading-5 text-slate-400">
                            {feature}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          <motion.div
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
            transition={{
              duration: 0.5,
              delay: 0.45,
            }}
            className="mx-auto mt-10 max-w-3xl text-center"
          >
            <p className="text-xs text-slate-600 sm:text-sm">
              Start with the Free plan and upgrade whenever you need more AI
              interview practice.
            </p>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default Pricing;
