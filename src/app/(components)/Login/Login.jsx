"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./styles.module.css";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/login`,
        // `https://simple-blogspot-for-final-exam-k0l59qby8-anrheys-projects.vercel.app/api/login`,
        {
          method: "POST",
          headers: {
            "Content-type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();
      const { token } = data;

      if (token) {
        localStorage.setItem("token", token);
        setSuccessMessage("Login successful! Redirecting to homepage...");
        setTimeout(() => {
          router.push("/homepage");
        }, 3000); // Redirect after 3 seconds
      } else {
        setErrorMessage("Login failed. Please check your email and password.");
      }
    } catch (error) {
      setErrorMessage("Login failed. Please try again later.");
      console.error("Login failed:", error);
      setErrorMessage("Login failed. Please try again later.");
      console.error("Login failed:", error);
      console.error("Error details:", error.message, error.stack);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.loginBox}>
        <h2 className={styles.title}>Login</h2>
        <form onSubmit={handleLogin}>
          <div className={styles.inputGroup}>
            <label htmlFor="email" className={styles.label}>
              Email:
            </label>
            <input
              type="email"
              id="email"
              name="email"
              onChange={handleChange}
              className={styles.input}
              placeholder="Email"
            />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="password" className={styles.label}>
              Password:
            </label>
            <input
              type="password"
              id="password"
              name="password"
              onChange={handleChange}
              className={styles.input}
              placeholder="Password"
            />
          </div>
          <button type="submit" className={styles.loginButton}>
            Login
          </button>
        </form>
        {successMessage && (
          <p className={styles.successMessage}>{successMessage}</p>
        )}
        {errorMessage && <p className={styles.errorMessage}>{errorMessage}</p>}
        <p className={styles.signup}>
          Don{"'"}t have an account?{" "}
          <a href="/RegistrationPage" className={styles.signupLink}>
            Sign up here
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;

// "use client";
// import React, { useState } from "react";
// import { useRouter } from "next/navigation";
// import styles from "./styles.module.css";

// const Login = () => {
//   const [formData, setFormData] = useState({
//     email: "",
//     password: "",
//   });
//   const router = useRouter();

//   const handleChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value,
//     });
//   };

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await fetch(
//         `${process.env.NEXT_PUBLIC_API_URL}/api/login`,
//         {
//           method: "POST",
//           headers: {
//             "Content-type": "application/json",
//           },
//           body: JSON.stringify(formData),
//         }
//       );

//       const data = await response.json(); // Ensure JSON parsing
//       const { token } = data; // Destructure token from response data

//       if (token) {
//         localStorage.setItem("token", token); // Store token in localStorage
//         console.log("Token:", token);
//         router.push("/homepage");
//       } else {
//         console.error("No token received");
//       }
//     } catch (error) {
//       console.error("Login failed:", error);
//     }
//   };

//   return (
//     <div className={styles.container}>
//       <div className={styles.loginBox}>
//         <h2 className={styles.title}>Login</h2>
//         <form onSubmit={handleLogin}>
//           <div className={styles.inputGroup}>
//             <label for="email" className={styles.label}>
//               Email:
//             </label>
//             <input
//               type="email"
//               id="email"
//               name="email"
//               onChange={handleChange}
//               className={styles.input}
//               placeholder="Email"
//             />
//           </div>
//           <div className={styles.inputGroup}>
//             <label for="password" className={styles.label}>
//               Password:
//             </label>
//             <input
//               type="password"
//               id="password"
//               name="password"
//               onChange={handleChange}
//               className={styles.input}
//               placeholder="Password"
//             />
//           </div>
//           <button type="submit" className={styles.loginButton}>
//             Login
//           </button>
//         </form>
//         <p className={styles.signup}>
//           Don{"'"}t have an account?{" "}
//           <a href="/RegistrationPage" className={styles.signupLink}>
//             Sign up here
//           </a>
//         </p>
//       </div>
//     </div>
//   );
// };

// export default Login;
