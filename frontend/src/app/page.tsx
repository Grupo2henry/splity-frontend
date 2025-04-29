import Image from "next/image";
export default function Home() {
  return (
    <div className="flex items-center h-full"> 
      <div className="relative">
        <Image src="/logo-splity.png" alt="Logo" width={353} height={357}/>
        <h1 className="absolute top-78 right-15 text-[12px] text-[#FFFFFF]">By Henry PF Grupo 2</h1>
      </div>
    </div>
  );
}
