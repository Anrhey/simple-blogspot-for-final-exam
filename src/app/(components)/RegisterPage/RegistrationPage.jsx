import React from "react";
import styles from "./styles.module.css";

const RegistrationPage = () => {
  return (
    <div className={styles.container}>
      <div className={styles.loginBox}>
        <h2 className={styles.title}>Create an account</h2>
        <form>
          <div className={styles.inputGroup}>
            <label for="email" className={styles.label}>
              Email:
            </label>
            <input
              type="email"
              id="email"
              className={styles.input}
              placeholder="Email"
            />
          </div>
          <div className={styles.inputGroup}>
            <label for="password" className={styles.label}>
              Password:
            </label>
            <input
              type="password"
              id="password"
              className={styles.input}
              placeholder="Password"
            />
          </div>
          <button type="submit" className={styles.loginButton}>
            Register
          </button>
        </form>
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
