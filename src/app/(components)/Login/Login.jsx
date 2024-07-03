import React from "react";
import styles from "./styles.module.css";

const Login = () => {
  return (
    <div className={styles.container}>
      <div className={styles.loginBox}>
        <h2 className={styles.title}>Login</h2>
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
            Login
          </button>
        </form>
        <p className={styles.signup}>
          Don't have an account?{" "}
          <a href="/RegistrationPage" className={styles.signupLink}>
            Sign up here
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;
