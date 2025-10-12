// "use client";
// import React, { useState, useEffect } from "react";
// import { useRouter, useSearchParams } from "next/navigation";
// import api from "../../utils/api";
// import { FaEnvelope, FaCheck, FaSpinner, FaRedo } from "react-icons/fa";

// const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

// export default function VerifyEmail() {
//   const router = useRouter();
//   const searchParams = useSearchParams();

//   const [otp, setOtp] = useState(["", "", "", "", "", ""]);
//   const [email, setEmail] = useState("");
//   const [userData, setUserData] = useState(null);
//   const [errorMessage, setErrorMessage] = useState("");
//   const [isLoading, setIsLoading] = useState(false);
//   const [isResending, setIsResending] = useState(false);
//   const [resendTimer, setResendTimer] = useState(60);

//   useEffect(() => {
//     // Get email and temp data from query params or localStorage
//     const emailParam = searchParams.get("email");
//     const tempDataParam = searchParams.get("tempData");

//     if (emailParam) setEmail(emailParam);
//     if (tempDataParam) {
//       try {
//         setUserData(JSON.parse(decodeURIComponent(tempDataParam)));
//       } catch (e) {
//         console.error("Error parsing temp data:", e);
//       }
//     }
//   }, [searchParams]);

//   // Countdown timer for resend
//   useEffect(() => {
//     if (resendTimer > 0) {
//       const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
//       return () => clearTimeout(timer);
//     }
//   }, [resendTimer]);

//   const handleOtpChange = (index, value) => {
//     if (value.length > 1) value = value[0];
//     if (!/^\d*$/.test(value)) return;

//     const newOtp = [...otp];
//     newOtp[index] = value;
//     setOtp(newOtp);

//     // Auto-focus next input
//     if (value && index < 5) {
//       document.getElementById(`otp-${index + 1}`)?.focus();
//     }
//   };

//   const handleKeyDown = (index, e) => {
//     if (e.key === "Backspace" && !otp[index] && index > 0) {
//       document.getElementById(`otp-${index - 1}`)?.focus();
//     }
//   };

//   const handleVerify = async (e) => {
//     e.preventDefault();
//     const otpCode = otp.join("");

//     if (otpCode.length !== 6) {
//       setErrorMessage("Please enter all 6 digits");
//       return;
//     }

//     setErrorMessage("");
//     setIsLoading(true);

//     try {
//       const response = await api.post(`${BASE_URL}/api/verify-email`, {
//         email,
//         otp: otpCode,
//         userData,
//       });

//       if (response.status === 201) {
//         // Store user data in localStorage to indicate email is verified
//         if (userData) {
//           localStorage.setItem(
//             "user",
//             JSON.stringify({
//               userName: userData.userName,
//               email: userData.email,
//               firstName: userData.firstName,
//               lastName: userData.lastName,
//               emailVerified: true,
//               profileCompleted: false,
//             })
//           );
//         }

//         // Redirect to profile page instead of login
//         router.push("/profile");
//       }
//     } catch (error) {
//       setErrorMessage(
//         error.response?.data?.message ||
//           "Verification failed. Please try again."
//       );
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleResend = async () => {
//     setIsResending(true);
//     setErrorMessage("");

//     try {
//       await api.post(`${BASE_URL}/api/resend-otp`, {
//         email,
//         type: "verification",
//       });

//       setResendTimer(60);
//       setOtp(["", "", "", "", "", ""]);
//       document.getElementById("otp-0")?.focus();
//     } catch (error) {
//       setErrorMessage(error.response?.data?.message || "Failed to resend OTP");
//     } finally {
//       setIsResending(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-green-50 flex items-center justify-center p-4">
//       <div className="w-full max-w-md">
//         <div className="text-center mb-8">
//           <div className="w-20 h-20 bg-gradient-to-r from-emerald-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
//             <FaEnvelope className="text-white text-2xl" />
//           </div>
//           <h1 className="text-3xl font-bold text-gray-900 mb-2">
//             Verify Your Email
//           </h1>
//           <p className="text-gray-600">
//             We've sent a 6-digit code to <br />
//             <span className="font-semibold">{email}</span>
//           </p>
//         </div>

//         <div className="bg-white rounded-3xl p-8 shadow-2xl">
//           <form onSubmit={handleVerify} className="space-y-6">
//             <div className="flex justify-center gap-2">
//               {otp.map((digit, index) => (
//                 <input
//                   key={index}
//                   id={`otp-${index}`}
//                   type="text"
//                   maxLength="1"
//                   value={digit}
//                   onChange={(e) => handleOtpChange(index, e.target.value)}
//                   onKeyDown={(e) => handleKeyDown(index, e)}
//                   className="w-12 h-14 text-center text-2xl font-bold border-2 border-gray-300 rounded-xl focus:border-green-500 focus:outline-none transition-colors"
//                 />
//               ))}
//             </div>

//             {errorMessage && (
//               <div className="bg-red-50 border-2 border-red-200 p-3 rounded-xl">
//                 <p className="text-red-700 text-sm text-center">
//                   {errorMessage}
//                 </p>
//               </div>
//             )}

//             <button
//               type="submit"
//               disabled={isLoading}
//               className={`w-full py-4 rounded-xl font-bold text-lg shadow-lg transition-all ${
//                 isLoading
//                   ? "bg-gray-400 cursor-not-allowed"
//                   : "bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:shadow-xl"
//               }`}
//             >
//               {isLoading ? (
//                 <span className="flex items-center justify-center gap-2">
//                   <FaSpinner className="animate-spin" />
//                   Verifying...
//                 </span>
//               ) : (
//                 <span className="flex items-center justify-center gap-2">
//                   <FaCheck />
//                   Verify Email
//                 </span>
//               )}
//             </button>
//           </form>

//           <div className="mt-6 text-center">
//             <p className="text-gray-600 mb-2">Didn't receive the code?</p>
//             {resendTimer > 0 ? (
//               <p className="text-gray-500 text-sm">Resend in {resendTimer}s</p>
//             ) : (
//               <button
//                 onClick={handleResend}
//                 disabled={isResending}
//                 className="text-green-600 font-semibold hover:text-green-700 flex items-center justify-center gap-2 mx-auto"
//               >
//                 <FaRedo className={isResending ? "animate-spin" : ""} />
//                 Resend Code
//               </button>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
"use client";
import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import api from "../../utils/api";
import { FaEnvelope, FaCheck, FaSpinner, FaRedo } from "react-icons/fa";
import { useAuth } from "contexts/AuthContext";

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export default function VerifyEmail() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth(); // ✅ Use AuthContext

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [email, setEmail] = useState("");
  const [userData, setUserData] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [resendTimer, setResendTimer] = useState(60);

  useEffect(() => {
    const emailParam = searchParams.get("email");
    const tempDataParam = searchParams.get("tempData");

    if (emailParam) setEmail(emailParam);
    if (tempDataParam) {
      try {
        setUserData(JSON.parse(decodeURIComponent(tempDataParam)));
      } catch (e) {
        console.error("Error parsing temp data:", e);
      }
    }
  }, [searchParams]);

  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  const handleOtpChange = (index, value) => {
    if (value.length > 1) value = value[0];
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`)?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`)?.focus();
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    const otpCode = otp.join("");

    if (otpCode.length !== 6) {
      setErrorMessage("Please enter all 6 digits");
      return;
    }

    setErrorMessage("");
    setIsLoading(true);

    try {
      const response = await api.post(`${BASE_URL}/api/verify-email`, {
        email,
        otp: otpCode,
        userData,
      });

      if (response.status === 201) {
        // ✅ FIXED: Use the complete response data from backend
        const verifiedUser = {
          _id: response.data._id,
          userName: response.data.userName,
          firstName: response.data.firstName,
          lastName: response.data.lastName,
          email: email,
          emailVerified: true, // ✅ Explicitly set
          profileCompleted: false, // ✅ Explicitly set
        };

        console.log("✅ Storing verified user:", verifiedUser);

        // ✅ Use AuthContext login method
        login(verifiedUser);

        // ✅ Redirect to profile
        router.push("/profile");
      }
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message ||
          "Verification failed. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    setIsResending(true);
    setErrorMessage("");

    try {
      await api.post(`${BASE_URL}/api/resend-otp`, {
        email,
        type: "verification",
      });

      setResendTimer(60);
      setOtp(["", "", "", "", "", ""]);
      document.getElementById("otp-0")?.focus();
    } catch (error) {
      setErrorMessage(error.response?.data?.message || "Failed to resend OTP");
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-green-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-r from-emerald-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaEnvelope className="text-white text-2xl" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Verify Your Email
          </h1>
          <p className="text-gray-600">
            We&apos;ve sent a 6-digit code to <br />
            <span className="font-semibold">{email}</span>
          </p>
        </div>

        <div className="bg-white rounded-3xl p-8 shadow-2xl">
          <form onSubmit={handleVerify} className="space-y-6">
            <div className="flex justify-center gap-2">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  id={`otp-${index}`}
                  type="text"
                  maxLength="1"
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className="w-12 h-14 text-center text-2xl font-bold border-2 border-gray-300 rounded-xl focus:border-green-500 focus:outline-none transition-colors"
                />
              ))}
            </div>

            {errorMessage && (
              <div className="bg-red-50 border-2 border-red-200 p-3 rounded-xl">
                <p className="text-red-700 text-sm text-center">
                  {errorMessage}
                </p>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-4 rounded-xl font-bold text-lg shadow-lg transition-all ${
                isLoading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:shadow-xl"
              }`}
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <FaSpinner className="animate-spin" />
                  Verifying...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <FaCheck />
                  Verify Email
                </span>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600 mb-2">Didn&apos;t receive the code?</p>
            {resendTimer > 0 ? (
              <p className="text-gray-500 text-sm">Resend in {resendTimer}s</p>
            ) : (
              <button
                onClick={handleResend}
                disabled={isResending}
                className="text-green-600 font-semibold hover:text-green-700 flex items-center justify-center gap-2 mx-auto"
              >
                <FaRedo className={isResending ? "animate-spin" : ""} />
                Resend Code
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
