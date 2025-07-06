"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import SuccessPopup from "../../components/successPopup"; // Adjust path if needed
import { useRouter } from "next/navigation";
import { useAuth } from "../../contexts/AuthContext"; // Adjust path if needed
export default function GigUpload() {
  const router = useRouter();
  const [localStr, setLocalStr] = useState(null);
  const [formData, setFormData] = useState({
    skillName: "",
    skillDescription: "",
    exchangeService: "",
    username: "",
    category: "",
  });
  const [showSuccess, setShowSuccess] = useState(false);
  const { user } = useAuth();
  useEffect(() => {
    if (!user) {
      router.push("/login");
    }
  }, [user, router]);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsed = JSON.parse(storedUser);
      setLocalStr(parsed);
      setFormData((prev) => ({
        ...prev,
        username: parsed.userName,
      }));
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post("http://localhost:5000/api/classify", {
        text: formData.skillDescription,
      });

      const gigData = {
        ...formData,
        category: data.category,
      };

      await axios.post("http://localhost:5000/api/upload-service", gigData);

      setShowSuccess(true);
      setFormData({
        skillName: "",
        skillDescription: "",
        exchangeService: "",
        username: localStr?.userName || "",
        category: "",
      });
    } catch (error) {
      console.error("Upload error:", error);
      alert("Failed to upload service.");
    }
  };

  if (!localStr) return <p className="text-center mt-10">Please log in.</p>;

  return (
    <div className="flex items-center justify-center h-screen bg-background">
      <div className="max-w-md w-full p-8 border border-gray-300 rounded-lg shadow-lg bg-white">
        {showSuccess && (
          <SuccessPopup
            message="Service uploaded successfully!"
            onClose={() => setShowSuccess(false)}
          />
        )}

        <h1 className="text-3xl font-bold text-headings text-center mb-8">
          Offer Your Service
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-black mb-2">Skill Name:</label>
            <input
              type="text"
              name="skillName"
              value={formData.skillName}
              onChange={handleChange}
              required
              className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:border-primaryButton"
            />
          </div>

          <div>
            <label className="block text-black mb-2">Skill Description:</label>
            <textarea
              name="skillDescription"
              value={formData.skillDescription}
              onChange={handleChange}
              required
              rows={3}
              className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:border-primaryButton resize-none"
            />
          </div>

          <div>
            <label className="block text-black mb-2">Exchange Service:</label>
            <input
              type="text"
              name="exchangeService"
              value={formData.exchangeService}
              onChange={handleChange}
              required
              className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:border-primaryButton"
            />
          </div>

          <button
            type="submit"
            className="w-full p-3 bg-black text-white font-semibold rounded-lg hover:bg-gray-900 transition-colors"
          >
            Upload Service
          </button>
        </form>
      </div>
    </div>
  );
}
