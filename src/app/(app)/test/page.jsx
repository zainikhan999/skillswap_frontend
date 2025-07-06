"use client";
import React, { useState } from "react";
import axios from "axios";

export default function Classifier() {
  const [text, setText] = useState("");
  const [category, setCategory] = useState("");
  const [confidence, setConfidence] = useState("");

  const handleClassify = async () => {
    try {
      const res = await axios.post("http://localhost:5000/api/classify", {
        text,
      });

      setCategory(res.data.category || "Uncertain");
      setConfidence(res.data.confidence?.toFixed(2) || "Low");
    } catch (err) {
      console.error("API error:", err);
      setCategory("Error");
      setConfidence("N/A");
    }
  };

  return (
    <div>
      <input
        type="text"
        value={text}
        placeholder="Enter your job description"
        onChange={(e) => setText(e.target.value)}
        style={{ padding: "8px", marginRight: "10px" }}
      />
      <button onClick={handleClassify}>Classify</button>
      <div>
        <h3>Category: {category}</h3>
        <h4>Confidence: {confidence}</h4>
      </div>
    </div>
  );
}
