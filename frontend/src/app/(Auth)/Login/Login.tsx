"use client";

import LoginForm from "@/components/Forms/LoginForm/LoginForm";
import { GoogleOAuthProvider } from "@react-oauth/google";
import styles from "./Login.module.css";

export const Login = () => {
  return (
    <GoogleOAuthProvider clientId="842582606972-u7o9ghielp8r2kvk3jus302kmslki4s5.apps.googleusercontent.com">
      <div className={styles.container}>
        <LoginForm />
      </div>
    </GoogleOAuthProvider>
  );
}

export default Login;