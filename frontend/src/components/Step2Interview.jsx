import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import maleVideo from "../assets/Videos/male-ai.mp4";
import femaleVideo from "../assets/Videos/female-ai.mp4";
import Timer from "./Timer";
import { FaArrowRight, FaMicrophone, FaMicrophoneSlash } from "react-icons/fa";
import api from "../utils/api";

const Step2Interview = ({ interviewData, onFinish }) => {
  // if (!interviewData) {
  //   return <div>Interview data not available</div>;
  // }

  const { interviewId, questions, userName } = interviewData;
  const [isIntroPhase, setIsIntroPhase] = useState(true);

  const [isMicOn, setIsMicOn] = useState(true);
  const recognitionRef = useRef(null);
  const [isAIPlaying, setIsAIPlaying] = useState(false);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState("");
  const [timeLeft, setTimeLeft] = useState(questions[0]?.timeLimit || 60);
  const [selectedVoice, setSelectedVoice] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [voiceGender, setVoiceGender] = useState("female");
  const [subtitles, setSubtitles] = useState("");

  const videoRef = useRef(null);
  const currentQuestion = questions[currentIndex];

  useEffect(() => {
    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      if (!voices.length) return;

      const femaleVoice = voices.find(
        (v) =>
          v.name.toLowerCase().includes("zira") ||
          v.name.toLowerCase().includes("samantha") ||
          v.name.toLowerCase().includes("female"),
      );

      if (femaleVoice) {
        setSelectedVoice(femaleVoice);
        setVoiceGender("female");
        return;
      }

      const maleVoice = voices.find(
        (v) =>
          v.name.toLowerCase().includes("brian") ||
          v.name.toLowerCase().includes("mark") ||
          v.name.toLowerCase().includes("male"),
      );

      if (maleVoice) {
        setSelectedVoice(maleVoice);
        setVoiceGender("male");
        return;
      }

      setSelectedVoice(voices[0]);
      setVoiceGender("female");
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
  }, []);

  const videoSource = voiceGender === "male" ? maleVideo : femaleVideo;

  const speakText = (text) => {
    return new Promise((resolve) => {
      if (!window.speechSynthesis || !selectedVoice) {
        resolve();
        return;
      }

      window.speechSynthesis.cancel();

      const humantext = text.replace(/,/g, ", ... ").replace(/\./g, ". ... ");

      const utterance = new SpeechSynthesisUtterance(humantext);
      utterance.voice = selectedVoice;

      utterance.rate = 0.92;
      utterance.pitch = 1.05;
      utterance.volume = 1;

      utterance.onstart = () => {
        setIsAIPlaying(true);
        stopMic();
        videoRef.current?.play();
      };

      utterance.onend = () => {
        videoRef.current?.pause();
        videoRef.current.currentTime = 0;
        setIsAIPlaying(false);

        if (isMicOn) {
          startMic();
        }

        setTimeout(() => {
          setSubtitles("");
          resolve();
        }, 300);
      };

      setSubtitles(text);

      window.speechSynthesis.speak(utterance);
    });
  };

  useEffect(() => {
    if (!selectedVoice) {
      return;
    }

    const runIntro = async () => {
      if (isIntroPhase) {
        await speakText(
          `Hi ${userName}, it's great to have you here. I hope you're feeling confident and ready for the interview.`,
        );

        await speakText(
          `I'll ask you a few questions. Just answer naturally, and take your time. Let's get started.`,
        );

        setIsIntroPhase(false);
      } else if (currentQuestion) {
        await new Promise((r) => setTimeout(r, 800));

        if (currentIndex === questions.length - 1) {
          await speakText("Alright, this one might be a bit more challenging.");
        }

        await speakText(currentQuestion.question);

        if (isMicOn) {
          startMic();
        }
      }
    };

    runIntro();
  }, [selectedVoice, isIntroPhase, currentIndex]);

  useEffect(() => {
    if (isIntroPhase) return;
    if (!currentQuestion) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isIntroPhase, currentIndex]);

  useEffect(() => {
    if (!isIntroPhase && currentQuestion) {
      setTimeLeft(currentQuestion.timeLimit || 60);
    }
  }, [currentIndex]);

  useEffect(() => {
    if (!window.webkitSpeechRecognition) return;

    const recognition = new window.webkitSpeechRecognition();
    recognition.lang = "en-US";
    recognition.continuous = true;
    recognition.interimResults = false;

    recognition.onresult = (event) => {
      const transcript = event.results[event.results.length - 1][0].transcript;

      setAnswer((prev) => prev + "" + transcript);
    };

    recognitionRef.current = recognition;
  }, []);

  const startMic = () => {
    if (recognitionRef.current && !isAIPlaying) {
      try {
        recognitionRef.current.start();
      } catch {
        // Speech recognition can throw if already active.
      }
    }
  };

  const stopMic = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
  };

  const toggleMic = () => {
    if (isMicOn) {
      stopMic();
    } else {
      startMic();
    }

    setIsMicOn(!isMicOn);
  };

  const submitAnswer = async () => {
    if (isSubmitting) return;

    stopMic();

    setIsSubmitting(true);

    try {
      const result = await api.post(
        "/interview/submit-answer",
        {
          interviewId,
          questionIndex: currentIndex,
          answer,
          timeTaken: currentQuestion.timeLimit - timeLeft,
        },
        { withCredentials: true },
      );

      setFeedback(result.data.feedback);
      speakText(result.data.feedback);
      setIsSubmitting(false);
    } catch (error) {
      console.error("Answer submission failed:", error);
      setIsSubmitting(false);
    }
  };

  const handleNext = async () => {
    setAnswer("");
    setFeedback("");

    if (currentIndex + 1 >= questions.length) {
      finishInterview();
      return;
    }

    await speakText("Alright, Let's move to the next question.");

    setCurrentIndex(currentIndex + 1);
    setTimeout(() => {
      if (isMicOn) {
        startMic();
      }
    }, 500);
  };

  const finishInterview = async () => {
    stopMic();
    setIsMicOn(false);
    try {
      const result = await api.post(
        "/interview/finish",
        {
          interviewId,
        },
        { withCredentials: true },
      );

      onFinish(result.data);
    } catch (error) {
      console.error("Interview finish failed:", error);
    }
  };

  useEffect(() => {
    if (isIntroPhase) return;
    if (!currentQuestion) return;
    if (timeLeft === 0 && !isSubmitting && !feedback) {
      submitAnswer();
    }
  }, [timeLeft]);

  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
        recognitionRef.current.abort();
      }

      window.speechSynthesis.cancel();
    };
  }, []);

  return (
    <div className="flex items-center justify-center bg-slate-950 text-white">
      <div className="w-full max-w-7xl min-h-[80vh] flex flex-col lg:flex-row overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] backdrop-blur-sm shadow-2xl">
        <div className="w-full lg:w-[40%] flex flex-col items-center justify-center p-6 md:p-8 border-b lg:border-b-0 lg:border-r border-white/10 bg-gradient-to-br from-cyan-500/[0.06] to-teal-500/[0.02]">
          <div className="w-full max-w-md">
            <h2 className="text-2xl font-bold text-white gradient-text mb-6 ">
              AI Interviewer
            </h2>

            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="relative w-full overflow-hidden rounded-2xl border border-white/10 bg-black/30 shadow-2xl"
            >
              <video
                src={videoSource}
                key={videoSource}
                ref={videoRef}
                muted
                playsInline
                preload="auto"
                className="w-full aspect-video object-cover"
              />

              {subtitles && (
                <div className="absolute bottom-3 left-3 right-3 rounded-xl border border-white/10 bg-slate-950/80 backdrop-blur-md px-4 py-3">
                  <p className="text-sm text-slate-200 text-center leading-relaxed">
                    {subtitles}
                  </p>
                </div>
              )}
            </motion.div>

            <div className="mt-5 rounded-2xl border border-white/10 bg-white/[0.03] p-5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium uppercase tracking-[0.15em] text-slate-500">
                  Interview Status
                </span>

                {isAIPlaying && (
                  <motion.div
                    initial={{ opacity: 0, x: 8 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center gap-2"
                  >
                    <span className="relative flex h-2.5 w-2.5">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-400 opacity-60" />
                      <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-cyan-400" />
                    </span>

                    <span className="text-xs font-medium text-cyan-400">
                      AI Speaking
                    </span>
                  </motion.div>
                )}
              </div>

              <div className="h-px bg-white/10 my-5" />

              <div className="flex justify-center">
                <Timer
                  timeLeft={timeLeft}
                  totalTime={currentQuestion?.timeLimit || 60}
                />
              </div>

              <div className="h-px bg-white/10 my-5" />

              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="rounded-xl bg-white/[0.03] border border-white/5 p-3">
                  <span className="block text-xl font-bold text-cyan-400">
                    {currentIndex + 1}
                  </span>

                  <span className="text-sm text-slate-500">
                    Current Question
                  </span>
                </div>

                <div className="rounded-xl bg-white/[0.03] border border-white/5 p-3">
                  <span className="block text-xl font-bold text-cyan-400">
                    {questions.length}
                  </span>

                  <span className="text-sm text-slate-500">
                    Total Questions
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Interview Questions */}

                <div className="flex-1 min-w-0 min-h-0 flex flex-col p-5 sm:p-6 lg:p-8">
          <div className="shrink-0 mb-5">
            <h2 className="text-xl sm:text-2xl lg:text-[26px] font-bold gradient-text">
              AI Smart Interview
            </h2>

            <p className="mt-1 text-xs sm:text-sm text-slate-500">
              Answer naturally and explain your approach clearly.
            </p>
          </div>

          {!isIntroPhase && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }}
              className="shrink-0 mb-4 rounded-2xl border border-white/10 bg-white/[0.025] p-4 sm:p-5"
            >
              <div className="text-left">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.15em] text-cyan-400">
                    Question {currentIndex + 1}
                  </span>

                  <span className="text-[10px] sm:text-xs text-slate-500">
                    {currentIndex + 1} / {questions.length}
                  </span>
                </div>

                <p className="text-sm sm:text-base lg:text-lg font-semibold text-slate-200 leading-relaxed">
                  {currentQuestion?.question}
                </p>
              </div>
            </motion.div>
          )}

          <div className="flex-1 min-h-0">
            {!feedback ? (
              <textarea
                placeholder="Type your answer here..."
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                className="w-full h-full min-h-[180px] resize-none rounded-2xl border border-white/10 bg-white/[0.025] px-4 py-4 sm:px-5 sm:py-5 text-sm sm:text-base text-slate-200 placeholder:text-slate-500 outline-none focus:border-cyan-400/40 focus:bg-white/[0.035] focus:ring-4 focus:ring-cyan-400/[0.06] transition-all duration-300"
              />
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35 }}
                className="h-full min-h-[180px] flex flex-col rounded-2xl border border-cyan-400/20 bg-cyan-400/[0.025] overflow-hidden"
              >
                <div className="px-5 py-4 border-b border-white/10">
                  <span className="text-xs font-semibold uppercase tracking-wider text-cyan-400">
                    Interview Feedback
                  </span>
                </div>

                <div className="flex-1 flex items-start p-5">
                  <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                    {feedback}
                  </p>
                </div>
              </motion.div>
            )}
          </div>

          {!feedback ? (
            <div className="shrink-0 flex items-center gap-3 mt-4">
              {!isSubmitting && (
                <motion.button
                  onClick={toggleMic}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.94 }}
                  className={`w-12 h-12 sm:w-14 sm:h-14 shrink-0 flex items-center justify-center rounded-xl border transition-all duration-300 ${
                    isMicOn
                      ? "bg-cyan-500 border-cyan-400/30 text-white shadow-lg shadow-cyan-500/20"
                      : "bg-white/[0.05] border-white/10 text-slate-400 hover:bg-white/[0.08]"
                  }`}
                >
                  {isMicOn ? (
                    <FaMicrophone size={19} />
                  ) : (
                    <FaMicrophoneSlash size={18} />
                  )}
                </motion.button>
              )}

              <motion.button
                onClick={submitAnswer}
                disabled={isSubmitting}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                className="flex-1 h-12 sm:h-14 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-500 text-sm sm:text-base font-semibold text-white shadow-lg shadow-cyan-500/10 hover:shadow-cyan-500/20 transition-all duration-300 disabled:opacity-70"
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                    Submitting...
                  </span>
                ) : (
                  "Submit Answer"
                )}
              </motion.button>
            </div>
          ) : (
            <motion.button
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              onClick={handleNext}
              className="shrink-0 mt-4 w-full h-12 sm:h-14 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-500 text-sm sm:text-base font-semibold text-white shadow-lg shadow-cyan-500/10 hover:shadow-cyan-500/20 transition-all duration-300"
            >
              Next Question
              <FaArrowRight size={14} />
            </motion.button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Step2Interview;
