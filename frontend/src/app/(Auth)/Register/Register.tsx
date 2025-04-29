import Image from "next/image";
import FormRegister from "@/components/FormRegister/FormRegister";

export const Register = () => {
  return (
    <div>
      <div className="flex flex-col items-center">
        <h1 className="text-[40px] text-center text-[#FFFFFF] mt-6">¡Bienvenido!</h1>
        <Image src="/logo-splity.png" alt="Logo" width={232} height={246}/>
      </div>
      <FormRegister />
    </div>
  );
}

export default Register;