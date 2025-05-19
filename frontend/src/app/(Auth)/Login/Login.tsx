import FormLogin from "@/components/FormLogin/FormLogin";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { GoogleLoginButton } from '@/components/GoogleAuth/GoogleLoginButton'
import Image from "next/image";
export const Login = () =>{
 
  return (
    <> 
    <GoogleOAuthProvider clientId="842582606972-u7o9ghielp8r2kvk3jus302kmslki4s5.apps.googleusercontent.com">
      <div className="flex flex-col items-center">
        <h1 className="text-[40px] text-center text-[#FFFFFF] mt-6">¡Bienvenido nuevamente!</h1>
        <Image src="/logo-splity.png" alt="Logo" width={232} height={246}/>
      </div>
      <FormLogin />
      <div className="flex justify-center items-center mt-8">
        <GoogleLoginButton />
      </div>
      </GoogleOAuthProvider>
      
    </>
  );
}

export default Login;