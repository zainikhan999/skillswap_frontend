// "use client";
// import React, { useState, useEffect } from "react";
// import { useRouter } from "next/navigation";
// import axios from "axios";
// import Link from "next/link";
// import { useAuth } from "../../contexts/AuthContext";
// export default function SignUp() {
//   const router = useRouter();
//   const { isAuthenticated, logout } = useAuth();

//   const [userName, setUserName] = useState("");
//   const [firstName, setFirstName] = useState("");
//   const [lastName, setLastName] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [errorMessage, setErrorMessage] = useState("");
//   const [userNameError, setUserNameError] = useState("");
//   const [emailError, setEmailError] = useState("");
//   const [showPopup, setShowPopup] = useState(false);
//   const { login } = useAuth();

//   // Redirect user if already logged in
//   useEffect(() => {
//     if (isAuthenticated) {
//       router.push("/profile"); // Redirect logged-in users to profile page
//     }
//   }, [isAuthenticated, router]);

//   const handleSubmit = async (event) => {
//     event.preventDefault();
//     setErrorMessage(""); // Clear any general error messages

//     try {
//       const response = await axios.post("http://localhost:5000/api/signup", {
//         userName,
//         firstName,
//         lastName,
//         email,
//         password,
//       });

//       if (response.status === 201) {
//         console.log("User registered successfully:", response.data);
//         const userData = { userName, firstName, lastName, email };
//         localStorage.setItem("user", JSON.stringify(userData));
//         login(userData.userName);
//         setShowPopup(true);

//         // Redirect to login page after 3 seconds
//         setTimeout(() => {
//           setShowPopup(false);
//           router.push("/profile"); // Redirect to login page after successful signup
//         }, 3000);
//       }
//     } catch (error) {
//       console.log("Error response:", error.response?.data);
//       const data = error.response?.data;
//       if (data && typeof data === "object" && "message" in data) {
//         setErrorMessage(data.message);
//       } else {
//         setErrorMessage("Signup failed. Please try again.");
//       }
//     }
//   };

//   const [errorMessages, setErrorMessages] = useState({});

//   return (
//     <>
//       <div className="flex items-center justify-center h-screen">
//         <div className="max-w-md w-full p-8 border border-gray-300 rounded-lg shadow-lg bg-white">
//           <h1 className="text-3xl font-bold text-gray-800 text-center mb-6">
//             Welcome User!
//           </h1>

//           <form onSubmit={handleSubmit} className="space-y-6">
//             <div>
//               <label className="block text-gray-800 mb-2">User Name</label>
//               <input
//                 type="text"
//                 value={userName}
//                 onChange={(e) => setUserName(e.target.value)}
//                 required
//                 className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
//               />
//               {errorMessages.userName && (
//                 <p className="text-orange-500 text-xs">
//                   {errorMessages.userName}
//                 </p>
//               )}
//             </div>

//             <div className="flex space-x-4">
//               <div className="w-1/2">
//                 <label className="block text-gray-800 mb-2">First Name</label>
//                 <input
//                   type="text"
//                   value={firstName}
//                   onChange={(e) => setFirstName(e.target.value)}
//                   required
//                   className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
//                 />
//               </div>
//               <div className="w-1/2">
//                 <label className="block text-gray-800 mb-2">Last Name</label>
//                 <input
//                   type="text"
//                   value={lastName}
//                   onChange={(e) => setLastName(e.target.value)}
//                   required
//                   className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
//                 />
//               </div>
//             </div>

//             <div>
//               <label className="block text-gray-800 mb-2">Email</label>
//               <input
//                 type="email"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 required
//                 className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
//               />
//               {errorMessages.email && (
//                 <p className="text-orange-500 text-xs">{errorMessages.email}</p>
//               )}
//             </div>

//             <div>
//               <label className="block text-gray-800 mb-2">Password</label>
//               <input
//                 type="password"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 required
//                 className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
//               />
//               {errorMessages.password && (
//                 <p className="text-orange-500 text-xs">
//                   {errorMessages.password}
//                 </p>
//               )}
//             </div>

//             {errorMessage && (
//               <p className="text-orange-500 text-sm text-center">
//                 {errorMessage}
//               </p>
//             )}

//             <button
//               type="submit"
//               className="w-full p-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition-colors"
//             >
//               Sign Up
//             </button>

//             <p className="text-center">
//               Already have an account?{" "}
//               <Link href="/login">
//                 <span className="text-blue-500 cursor-pointer">Login</span>
//               </Link>
//             </p>
//           </form>
//         </div>
//       </div>

//       {showPopup && (
//         <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
//           <div className="bg-white p-6 rounded-lg shadow-lg text-center">
//             <p className="text-lg text-green-600">
//               You have successfully signed up!
//             </p>
//           </div>
//         </div>
//       )}
//     </>
//   );
// }
"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Link from "next/link";
import { useAuth } from "../../contexts/AuthContext";

export default function SignUp() {
  const router = useRouter();
  const { isAuthenticated, login } = useAuth();

  const [userName, setUserName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [errorMessages, setErrorMessages] = useState({});
  const [showPopup, setShowPopup] = useState(false);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.push("/profile");
    }
  }, [isAuthenticated, router]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage("");

    try {
      const response = await axios.post("http://localhost:5000/api/signup", {
        userName,
        firstName,
        lastName,
        email,
        password,
      });

      if (response.status === 201) {
        const userData = { userName, firstName, lastName, email };
        login(userData);
        setShowPopup(true);

        setTimeout(() => {
          setShowPopup(false);
          router.push("/profile");
        }, 3000);
      }
    } catch (error) {
      const data = error.response?.data;
      if (data && typeof data === "object" && "message" in data) {
        setErrorMessage(data.message);
      } else {
        setErrorMessage("Signup failed. Please try again.");
      }
    }
  };

  return (
    <>
      <div className="flex items-center justify-center h-screen">
        <div className="max-w-md w-full p-8 border border-gray-300 rounded-lg shadow-lg bg-white">
          <h1 className="text-3xl font-bold text-gray-800 text-center mb-6">
            Welcome User!
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-gray-800 mb-2">User Name</label>
              <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                required
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              />
              {errorMessages.userName && (
                <p className="text-orange-500 text-xs">
                  {errorMessages.userName}
                </p>
              )}
            </div>

            <div className="flex space-x-4">
              <div className="w-1/2">
                <label className="block text-gray-800 mb-2">First Name</label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                />
              </div>
              <div className="w-1/2">
                <label className="block text-gray-800 mb-2">Last Name</label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-800 mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              />
              {errorMessages.email && (
                <p className="text-orange-500 text-xs">{errorMessages.email}</p>
              )}
            </div>

            <div>
              <label className="block text-gray-800 mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              />
              {errorMessages.password && (
                <p className="text-orange-500 text-xs">
                  {errorMessages.password}
                </p>
              )}
            </div>

            {errorMessage && (
              <p className="text-orange-500 text-sm text-center">
                {errorMessage}
              </p>
            )}

            <button
              type="submit"
              className="w-full p-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition-colors"
            >
              Sign Up
            </button>

            <p className="text-center">
              Already have an account?{" "}
              <Link href="/login">
                <span className="text-blue-500 cursor-pointer">Login</span>
              </Link>
            </p>
          </form>
        </div>
      </div>

      {showPopup && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <p className="text-lg text-green-600">
              You have successfully signed up!
            </p>
          </div>
        </div>
      )}
    </>
  );
}
