"use client";

import React, { useState } from "react";
import { UploadButton } from "../../../utils/uploadthing";
import { Avatar } from "@mui/material";
import { useRouter } from "next/navigation";
import styles from "./styles.module.css";

const RegistrationPage = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    name: "",
    password: "",
    profileImage: "",
  });
  const [successMessage, setSuccessMessage] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`/api/register`, {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (res.ok) {
        setSuccessMessage("Registration successful! Redirecting to login...");
        setTimeout(() => {
          router.push("/login");
        }, 3000); // Redirect after 3 seconds
      } else {
        console.error(data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.loginBox}>
        <h2 className={styles.title}>Create an account</h2>
        <form onSubmit={handleSubmit}>
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
            <label htmlFor="name" className={styles.label}>
              Name:
            </label>
            <input
              type="text"
              id="name"
              name="name"
              onChange={handleChange}
              className={styles.input}
              placeholder="Name"
            />
          </div>
          <div className={styles.inputGroup}>
            <UploadButton
              endpoint="imageUploader"
              onClientUploadComplete={(res) => {
                console.log("Files: ", res);
                setFormData((prevData) => ({
                  ...prevData,
                  profileImage: res[0].url,
                }));
              }}
              onUploadError={(error) => {
                alert(`ERROR! ${error.message}`);
              }}
            />
            {formData.profileImage.length ? (
              <div>
                <Avatar
                  src={formData.profileImage}
                  alt="my image"
                  className={styles.image}
                  name="profileImage"
                  key={formData.profileImage}
                />
              </div>
            ) : (
              "Click the upload button above to upload profile picture"
            )}
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
            Register
          </button>
        </form>
        {successMessage && (
          <p className={styles.successMessage}>{successMessage}</p>
        )}
        <p className={styles.signup}>
          Already have an account?{" "}
          <a href="/login" className={styles.signupLink}>
            Sign in here
          </a>
        </p>
      </div>
    </div>
  );
};

export default RegistrationPage;

// "use client";

// import React, { useState } from "react";
// import { UploadButton } from "../../../utils/uploadthing";
// import { Avatar } from "@mui/material";
// import { useRouter } from "next/navigation";
// import styles from "./styles.module.css";

// const RegistrationPage = () => {
//   const router = useRouter();
//   const [formData, setFormData] = useState({
//     email: "",
//     name: "",
//     password: "",
//     profileImage: "",
//   });

//   const handleChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value,
//     });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     try {
//       const res = await fetch("/api/register", {
//         method: "POST",
//         headers: {
//           "Content-type": "application/json",
//         },
//         body: JSON.stringify(formData),
//       });

//       const data = await res.json();
//       console.log(data);
//       router.push("/login");
//       return data;
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   return (
//     <div className={styles.container}>
//       <div className={styles.loginBox}>
//         <h2 className={styles.title}>Create an account</h2>
//         <form onSubmit={handleSubmit}>
//           <div className={styles.inputGroup}>
//             <label htmlFor="email" className={styles.label}>
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
//             <label htmlFor="name" className={styles.label}>
//               Name:
//             </label>
//             <input
//               type="text"
//               id="name"
//               name="name"
//               onChange={handleChange}
//               className={styles.input}
//               placeholder="Name"
//             />
//           </div>
//           <div className={styles.inputGroup}>
//             <UploadButton
//               endpoint="imageUploader"
//               onClientUploadComplete={(res) => {
//                 // Do something with the response
//                 console.log("Files: ", res);
//                 //setFormData({ profileImage: res[0].url });
//                 setFormData((prevData) => ({
//                   ...prevData,
//                   profileImage: res[0].url,
//                 }));
//               }}
//               onUploadError={(error) => {
//                 // Do something with the error.
//                 alert(`ERROR! ${error.message}`);
//               }}
//             />
//             {formData.profileImage.length ? (
//               <div>
//                 <Avatar
//                   src={formData.profileImage}
//                   alt="my image"
//                   className={styles.image}
//                   name="profileImage"
//                   // value={formData.profileImage}
//                   key={formData.profileImage}
//                 />
//               </div>
//             ) : (
//               "Click the upload button above to upload profile picture"
//             )}
//           </div>
//           <div className={styles.inputGroup}>
//             <label htmlFor="password" className={styles.label}>
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
//             Register
//           </button>
//         </form>
//         <p className={styles.signup}>
//           Already have an account?{" "}
//           <a href="/login" className={styles.signupLink}>
//             Sign in here
//           </a>
//         </p>
//       </div>
//     </div>
//   );
// };

// export default RegistrationPage;
