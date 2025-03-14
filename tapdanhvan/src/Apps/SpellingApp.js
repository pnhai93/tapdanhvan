import React, { useState } from "react";
import { Card, CardContent } from "@mui/material";
import Button from "@mui/material/Button";
import { motion } from "framer-motion";

const words = [
  { word: "M?", image: "/images/me.png", spell:"m? e me n?ng m?" },
  { word: "B�", image: "/images/be.png", spell:"B? e be s?c b�" },
  { word: "C�", image: "/images/ca.png", spell:"c? a ca s?c c�" },
];

const playAudioOnline = async (text) => {
  const apiKey = "d99iOxd7UIHqRPRX04zv8oDE6kLh2TUQ"; // Thay b?ng API Key c?a b?n

  try {
    const response = await fetch("https://api.fpt.ai/hmi/tts/v5", {
      method: "POST",
      headers: {
        "api-key": apiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text }), // Ch? g?i ?�ng v?n b?n, kh�ng th�m g� kh�c
    });

    const data = await response.json();

    if (data && data.async) {
      console.log("TTS URL:", data.async); // Ki?m tra URL
      const audio = new Audio(data.async);
      audio.play();
    } else {
      console.error("Kh�ng l?y ???c file �m thanh t? API:", data);
    }
  } catch (error) {
    console.error("L?i khi g?i API FPT:", error);
  }
};

export default function SpellingGame() {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [highlightIndex, setHighlightIndex] = useState(-1);
  const currentWord = words[currentWordIndex];

  const playAudio = () => {
    playAudioOnline(currentWord.spell);
  };

  const spellWord = () => {
    const letters = currentWord.word.split("");
    let index = 0;

    const speakLetter = () => {
      if (index < letters.length) {
        setHighlightIndex(index);
        playAudioOnline(letters[index]);
        setTimeout(() => {
          index++;
          speakLetter();
        }, 800);
      } else {
        setHighlightIndex(-1);
      }
    };
    speakLetter();
  };

  const nextWord = () => {
    setCurrentWordIndex((prevIndex) => (prevIndex + 1) % words.length);
    setHighlightIndex(-1);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-blue-100">
      <h1 className="text-3xl font-bold mb-4">T?p ?�nh V?n</h1>
      <Card className="w-80 p-4 bg-white shadow-lg rounded-xl">
        <CardContent className="flex flex-col items-center">
          <motion.img src={currentWord.image} alt={currentWord.word} className="w-40 h-40 object-contain mb-4" animate={{ scale: [0.9, 1.1, 1] }} transition={{ duration: 0.5 }} />
          <motion.h2 className="text-2xl font-bold flex space-x-1" animate={{ scale: [0.9, 1.1, 1] }} transition={{ duration: 0.5 }}>
            {currentWord.word.split("").map((letter, index) => (
              <span key={index} className={index === highlightIndex ? "text-red-500" : "text-black"}>
                {letter}
              </span>
            ))}
          </motion.h2>
          <Button className="mt-4 bg-green-500 hover:bg-green-600" onClick={playAudio}>
            Nghe ph�t �m
          </Button>
          <Button className="mt-2 bg-yellow-500 hover:bg-yellow-600" onClick={spellWord}>
            ?�nh v?n
          </Button>
          <Button className="mt-2 bg-blue-500 hover:bg-blue-600" onClick={nextWord}>
            T? ti?p theo
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
