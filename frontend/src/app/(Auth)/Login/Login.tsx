import FormLogin from "@/components/FormLogin/FormLogin";
import Image from "next/image";
export const Login = () =>{
  return (
    <> 
      <div className="flex flex-col items-center">
        <h1 className="text-[40px] text-center text-[#FFFFFF] mt-6">¡Bienvenido nuevamente!</h1>
        <Image src="/logo-splity.png" alt="Logo" width={232} height={246}/>
      </div>
      <FormLogin />
    </>
  );
}

export default Login;