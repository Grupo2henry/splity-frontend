import FormRegister from "@/components/Forms/RegisterForm/RegisterForm";
import { GoogleOAuthProvider } from "@react-oauth/google";
import styles from "../Login/Login.module.css";

export const Register = () => {
  return (
    <GoogleOAuthProvider clientId="842582606972-u7o9ghielp8r2kvk3jus302kmslki4s5.apps.googleusercontent.com">
      <div className={styles.container}>
        <FormRegister />
      </div>
    </GoogleOAuthProvider>
  );
}

export default Register;