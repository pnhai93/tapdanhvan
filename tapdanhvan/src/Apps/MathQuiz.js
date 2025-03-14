import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@mui/material";
import apple from "../images/apple.png";
import pencil from "../images/pencil.png";
import "../App.css";

// Hàm tạo câu hỏi ngẫu nhiên
const generateQuestion = (operation) => {
  let num1, num2, question, answer, image;

  if (operation === "+") {
    num1 = Math.floor(Math.random() * 5) + 1;
    num2 = Math.floor(Math.random() * (10 - num1)) + 1;
    question = `${num1} + ${num2} = ?`;
    answer = num1 + num2;
    image = apple;
  } else if (operation === "-") {
    num1 = Math.floor(Math.random() * 9) + 1;
    num2 = Math.floor(Math.random() * num1) + 1;
    question = `${num1} - ${num2} = ?`;
    answer = num1 - num2;
    image = pencil;
  }

  return { num1, num2, question, answer, image };
};

// Web Speech API
const speakText = (text) => {
  if ("speechSynthesis" in window) {
    // Thay thế ký hiệu phép toán bằng chữ
    const textToSpeak = text.replace("+", "cộng").replace("-", "trừ");

    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.lang = "vi-VN";
    utterance.rate = 0.3; // Tốc độ đọc bình thường
    utterance.pitch = 1; // Cao độ bình thường
    speechSynthesis.speak(utterance);
  } else {
    console.warn("Trình duyệt không hỗ trợ Web Speech API.");
  }
};

export default function MathQuiz() {
  const [operation, setOperation] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    if (operation) {
      setCurrentIndex(0);
      setScore(0);
      setFinished(false);
      setCurrentQuestion(generateQuestion(operation));
    }
  }, [operation]);

  useEffect(() => {
    if (soundEnabled && currentQuestion) {
      speakText(currentQuestion.question);
    }
  }, [currentQuestion, soundEnabled]);

  const handleAnswer = (option) => {
    if (option === currentQuestion.answer) {
      setScore(score + 1);
      setFeedback("🎉 Giỏi lắm!");
    } else {
      setFeedback("❌ Sai rồi! Cố lên nhé!");
    }

    setTimeout(() => {
      setFeedback("");
      if (currentIndex < 9) {
        setCurrentIndex(currentIndex + 1);
        setCurrentQuestion(generateQuestion(operation));
      } else {
        setFinished(true);
      }
    }, 1500);
  };

  const resetGame = () => {
    setOperation(null);
    setFinished(false);
    setCurrentIndex(0);
    setScore(0);
  };

  return (
    <div className="math-quiz-container">
      {!operation ? (
        <div className="operation-selection">
          <h1>Chọn phép toán:</h1>
          <Button variant="contained" color="primary" onClick={() => setOperation("+")}>
            Cộng ➕
          </Button>
          <Button variant="contained" color="secondary" onClick={() => setOperation("-")}>
            Trừ ➖
          </Button>
        </div>
      ) : finished ? (
        <div className="result-screen">
          <h1>🎉 Kết thúc!</h1>
          <p>Điểm số của bạn: {score} / 10</p>
          <Button variant="contained" color="success" onClick={resetGame}>
            🔄 Chơi lại
          </Button>
        </div>
      ) : (
        currentQuestion && (
          <div>
            <motion.h1 className="text-2xl font-bold" animate={{ scale: 1.2 }}>
              {currentQuestion.question}
            </motion.h1>

            {/* Hiển thị hình ảnh theo dạng lưới 3x3 */}
            <div className="grid-container">
              <div className="grid">
                {Array.from({ length: currentQuestion.num1 }).map((_, i) => (
                  <img key={`num1-${i}`} src={currentQuestion.image} alt="Quiz" className="grid-item" />
                ))}
              </div>

              <span className="operator">{operation}</span>

              <div className="grid">
                {Array.from({ length: currentQuestion.num2 }).map((_, i) => (
                  <img key={`num2-${i}`} src={currentQuestion.image} alt="Quiz" className="grid-item" />
                ))}
              </div>
            </div>

            <div className="answer-buttons">
              {[currentQuestion.answer, currentQuestion.answer + 1, currentQuestion.answer - 1]
                .sort(() => Math.random() - 0.5)
                .map((option, index) => (
                  <Button key={index} variant="contained" color="primary" onClick={() => handleAnswer(option)}>
                    {option}
                  </Button>
                ))}
            </div>

            <motion.p className="mt-4 text-lg font-bold" animate={{ opacity: [0, 1] }}>
              {feedback}
            </motion.p>

            <button onClick={() => setSoundEnabled(!soundEnabled)} className="mt-4 px-4 py-2 bg-gray-200 rounded">
              {soundEnabled ? "🔊 Tắt âm" : "🔈 Bật âm"}
            </button>

            <p className="mt-2">Câu hỏi {currentIndex + 1}/10</p>
            <p className="mt-2">Điểm số: {score}</p>
          </div>
        )
      )}
    </div>
  );
}
