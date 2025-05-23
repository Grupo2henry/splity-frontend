import Link from "next/link";
import Image from "next/image";

export const NavBar_Event_Details = () => {
    return (
        <div className="w-full h-full flex flex-col justify-end mt-6">
            <div className="flex flex-col gap-6">
                <div className="flex flex-col items-center">
                    <Link href={`/Add_Spent`}><Image src="/add_circle.svg" alt="Logo" width={60} height={60}/></Link>
                    <p className="text-[#FAFF00]">Agregar gasto</p>
                </div>            
            </div>
        </div>
    );
}

export default NavBar_Event_Details;