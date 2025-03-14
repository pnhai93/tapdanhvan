import React, { useState } from "react";
import MathQuiz from "./Apps/MathQuiz.js";
import SpellingApp from "./Apps/SpellingApp.js";

export default function MainApp() {
  const [selectedApp, setSelectedApp] = useState(null);

  if (selectedApp === "math") {
    return <MathQuiz />;
  }
  if (selectedApp === "spelling") {
    return <SpellingApp />;
  }

  return (
    <div className="p-4 text-center">
      <h1 className="text-3xl font-bold">Chọn ứng dụng</h1>
      <div className="flex justify-center gap-4 mt-6">
        <button onClick={() => setSelectedApp("spelling")} className="px-6 py-3 bg-blue-500 text-white rounded-lg text-xl">
          Tập Đánh Vần
        </button>
        <button onClick={() => setSelectedApp("math")} className="px-6 py-3 bg-green-500 text-white rounded-lg text-xl">
          Học Toán
        </button>
      </div>
    </div>
  );
}
