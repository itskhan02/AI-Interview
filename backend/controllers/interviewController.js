import fs from "fs";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs";
import { askAi } from "../services/openRouter.js";
import User from "../models/User.js";
import Interview from "../models/Interview.js";

export const analyzeResume = async (req, res) => {
  try {
    if (!req.file) {
      return res
        .status(400)
        .json({ message: "No file uploaded. Resume required" });
    }

    const filepath = req.file.path;

    const fileBuffer = await fs.promises.readFile(filepath);
    const uint8Array = new Uint8Array(fileBuffer);

    const pdf = await pdfjsLib.getDocument({ data: uint8Array }).promise;

    let resumeText = "";

    //Extract text from all pages
    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const content = await page.getTextContent();

      const pageText = content.items.map((item) => item.str).join(" ");
      resumeText += pageText + "\n";
    }

    resumeText = resumeText.replace(/\s+/g, " ").trim();

    const messages = [
      {
        role: "system",
        content: `
    You are an expert resume analyzer.

    Analyze the resume and extract accurate, structured information.
    Use only information explicitly available in the resume. Do not invent or assume details.

    Return ONLY valid JSON in exactly this format:

    {
      "candidateName": "string",
      "role": "string",
      "experience": "string",
      "skills": [],
      "projects": []
    }

    Rules:
    - Use "" when information is unavailable.
    - Use [] when no items are found.
    - Keep skills and projects as separate items.
    - Do not include markdown, explanations, or extra fields.
    `,
      },
      {
        role: "user",
        content: `
    Analyze this resume and return the required JSON:

    ${resumeText}
    `,
      },
    ];

    const aiResponse = await askAi(messages);

    const parsed = JSON.parse(aiResponse);

    fs.unlinkSync(filepath);

    res.json({
      role: parsed.role,
      experience: parsed.experience,
      skills: parsed.skills,
      projects: parsed.projects,
      resumeText,
    });
  } catch (error) {
    console.error("Resume analysis failed:", error.message);

    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    res.status(500).json({ message: "Failed to analyze resume" });
  }
};

export const generateQuestions = async (req, res) => {
  try {
    let { role, experience, mode, resumeText, projects, skills } = req.body;

    role = role.trim();
    experience = experience.trim();
    mode = mode.trim();

    if (!role || !experience || !mode) {
      return res
        .status(400)
        .json({ message: "Role, Experience, and Mode are required" });
    }

    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.credits < 50) {
      return res.status(400).json({ message: "Not enough credits" });
    }

    const projectText =
      Array.isArray(projects) && projects.length > 0
        ? projects.join(", ")
        : "None";

    const skillText =
      Array.isArray(skills) && skills.length > 0 ? skills.join(", ") : "None";

    const safeResume = resumeText?.trim() || "None";

    const userPrompt = `
    Role: ${role}
    Experience: ${experience}
    InterviewMode: ${mode}
    Projects: ${projectText}
    Skills: ${skillText}
    Resume: ${safeResume}
    `;

    if (!userPrompt.trim()) {
      return res.status(400).json({ message: "Prompt content is empty" });
    }

    const messages = [
      {
        role: "system",
        content: `
You are a professional human interviewer conducting a realistic interview.

Speak in simple, natural English as if you are directly speaking to the candidate.

Generate exactly 5 personalized interview questions :
- Candidate's role
- Experience
- Skills
- Projects
- Resume details


Strict Rules:
- Generate exactly 5 questions.
- Each question must contain 15–25 words.
- Each question must be one complete sentence.
- Do NOT number the questions.
- Do NOT add explanations, headings, or extra text.
- Put exactly one question on each line.
- Keep the language simple and conversational.
- Make questions practical and realistic.
- Do not repeat the same topic.
- Use the candidate's actual skills and projects when relevant.
- Do not assume information that is not provided.

Difficulty progression:
Question 1 → Easy
Question 2 → Easy
Question 3 → Medium
Question 4 → Medium
Question 5 → Hard

Make questions based on the candidate’s role, experience, interviewMode, projects, skills, and resume details.

Interview Mode: ${mode}

For Technical Interview:
Focus on technical knowledge, projects, coding, problem-solving, debugging, and technologies mentioned in the resume.

For HR Interview:
Focus on communication, motivation, teamwork, strengths, weaknesses, experience, and behavioral situations.
`,
      },
      {
        role: "user",
        content: userPrompt,
      },
    ];

    const aiResponse = await askAi(messages);

    if (!aiResponse || !aiResponse.trim()) {
      return res.status(500).json({ message: "AI returned empty response" });
    }

    const questionsArray = aiResponse
      .split("\n")
      .map((q) => q.trim())
      .filter((q) => q.length > 0)
      .slice(0, 5);

    if (questionsArray.length === 0) {
      return res
        .status(500)
        .json({ message: "AI failed to generate questions" });
    }

    user.credits -= 50;
    await user.save();

    const interview = await Interview.create({
      userId: user._id,
      role,
      experience,
      mode,
      resumeText: safeResume,
      questions: questionsArray.map((q, index) => ({
        question: q,
        difficulty: ["easy", "easy", "medium", "medium", "hard"][index],
        timeLimit: [60, 60, 90, 90, 120][index],
      })),
    });

    res.json({
      interviewId: interview._id,
      creditsLeft: user.credits,
      userName: user.name,
      questions: interview.questions,
    });
  } catch (error) {
    console.error("Question generation failed:", error.message);
    return res.status(500).json({ message: "Failed to generate questions" });
  }
};

export const submitAnswer = async (req, res) => {
  try {
    const { interviewId, questionIndex, answer, timeTaken } = req.body;

    const interview = await Interview.findById(interviewId);

    if (!interview) {
      return res.status(404).json({ message: "Interview not found" });
    }

    const question = interview.questions[questionIndex];

    if (!question) {
      return res.status(400).json({ message: "Invalid question index" });
    }

    if (!answer) {
      question.score = 0;
      question.feedback = "No answer provided";
      question.answer = "";

      await interview.save();

      return res.json({ feedback: question.feedback });
    }

    if (timeTaken > question.timeLimit) {
      question.score = 0;
      question.feedback = "Time limit exceeded. Answer not evaluated.";
      question.answer = answer;

      await interview.save();

      return res.json({ feedback: question.feedback });
    }

    const messages = [
      {
        role: "system",
        content: `
You are a professional human interviewer evaluating a candidate's answer in a real interview.

Evaluate the answer fairly and realistically based on the question asked.

Score each category from 0 to 10:

1. Confidence
- How clearly and confidently the candidate presents the answer.
- Does the answer sound clear, confident, and well-presented?

2. Communication
- How clear, structured, and easy to understand the answer is.
- Does the answer sound clear, structured, and easy to understand?

3. Correctness
- How accurate, relevant, and complete the answer is.

Scoring Guidelines:
- 0–2 = Very weak
- 3–4 = Weak
- 5–6 = Average
- 7–8 = Good
- 9–10 = Excellent

Rules:
- Be realistic and unbiased.
- Do not give random high scores.
- Weak or incomplete answers must receive lower scores.
- Strong, accurate, and well-explained answers should receive higher scores.
- Judge the answer based on the question asked.
- Do not penalize minor grammar mistakes if the meaning is clear.
- Consider clarity, structure, relevance, and accuracy.

Calculate:
finalScore = average of confidence, communication, and correctness, rounded to the nearest whole number.

Feedback:
- Give natural human interview feedback.
- Write 10–15 words only.
- Sound like real interview feedback
- Be honest and constructive.
- Keep tone professional and honest.
- Mention an improvement when appropriate.
- Do NOT repeat the question.
- Do NOT explain the scoring.
- Do NOT include extra text.

Return ONLY valid JSON:

{
  "confidence": number,
  "communication": number,
  "correctness": number,
  "finalScore": number,
  "feedback": "short human feedback"
}
`,
      },
      {
        role: "user",
        content: `
        Question: ${question.question}

        Candidate Answer: ${answer}
`,
      },
    ];

    const aiResponse = await askAi(messages);

    const parsed = JSON.parse(aiResponse);

    question.answer = answer;
    question.confidence = parsed.confidence;
    question.communication = parsed.communication;
    question.correctness = parsed.correctness;
    question.score = parsed.finalScore;
    question.feedback = parsed.feedback;

    await interview.save();

    return res.status(200).json({ feedback: parsed.feedback });
  } catch (error) {
    console.error("Answer submission failed:", error.message);
    return res.status(500).json({ message: "Failed to submit answer" });
  }
};

export const finishInterview = async (req, res) => {
  try {
    const { interviewId } = req.body;

    const interview = await Interview.findById(interviewId);

    if (!interview) {
      return res.status(404).json({ message: "Interview not found" });
    }

    const totalQuestions = interview.questions.length;

    let totalScore = 0;
    let totalConfidence = 0;
    let totalCommunication = 0;
    let totalCorrectness = 0;

    interview.questions.forEach((q) => {
      totalScore += q.score || 0;
      totalConfidence += q.confidence || 0;
      totalCommunication += q.communication || 0;
      totalCorrectness += q.correctness || 0;
    });

    const finalScore = totalQuestions ? totalScore / totalQuestions : 0;

    const avgConfidence = totalQuestions ? totalConfidence / totalQuestions : 0;

    const avgCommunication = totalQuestions
      ? totalCommunication / totalQuestions
      : 0;

    const avgCorrectness = totalQuestions
      ? totalCorrectness / totalQuestions
      : 0;

    interview.finalScore = finalScore;
    interview.status = "Completed";

    await interview.save();

    return res.status(200).json({
      finalScore: Number(finalScore.toFixed(1)),
      avgConfidence: Number(avgConfidence.toFixed(1)),
      avgCommunication: Number(avgCommunication.toFixed(1)),
      avgCorrectness: Number(avgCorrectness.toFixed(1)),
      questionWiseScores: interview.questions.map((q) => ({
        question: q.question,
        score: q.score || 0,
        feedback: q.feedback || "",
        confidence: q.confidence || 0,
        communication: q.communication || 0,
        correctness: q.correctness || 0,
      })),
    });
  } catch (error) {
    console.error("Interview finish failed:", error.message);
    return res.status(500).json({ message: "Failed to finish interview" });
  }
};

export const getMyInterviews = async (req, res) => {
  try {
    const interview = await Interview.find({ userId: req.userId })
      .sort({ createdAt: -1 })
      .select("role experience mode finalScore status createdAt");

    return res.status(200).json(interview);
  } catch (error) {
    console.error("Interview history lookup failed:", error.message);
    return res.status(500).json({ message: "Failed to find currentUser Interview" });
  }
};

export const getInterviewReport = async (req, res) => {
  try {
    const interview = await Interview.findById(req.params.id);

    if (!interview) {
      return res.status(404).json({ message: "Interview not found" });
    }

    const totalQuestions = interview.questions.length;

    let totalConfidence = 0;
    let totalCommunication = 0;
    let totalCorrectness = 0;

    interview.questions.forEach((q) => {
      totalConfidence += q.confidence || 0;
      totalCommunication += q.communication || 0;
      totalCorrectness += q.correctness || 0;
    });


    const avgConfidence = totalQuestions ? totalConfidence / totalQuestions : 0;

    const avgCommunication = totalQuestions
      ? totalCommunication / totalQuestions
      : 0;

    const avgCorrectness = totalQuestions
      ? totalCorrectness / totalQuestions
      : 0;

      return res.status(200).json({
        finalScore: interview.finalScore,
        confidence: Number(avgConfidence.toFixed(1)),
        communication: Number(avgCommunication.toFixed(1)),
        correctness: Number(avgCorrectness.toFixed(1)),
        questionWiseScores: interview.questions
      })

  } catch (error) {
    console.error("Interview report lookup failed:", error.message);
    return res.status(500).json({ message: "Failed to find currentUser Interview Report" });
  }
};
