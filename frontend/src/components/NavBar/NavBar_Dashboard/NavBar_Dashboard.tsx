import Link from "next/link";
import Image from "next/image";

export const NavBar_Dashboard = () => {
    return (
        <div className="w-full h-full flex flex-col justify-end">
            <div className="flex flex-col gap-6">
                <div className="flex flex-col items-center">
                    <Link href="/Create_Event"><Image src="/add_circle.svg" alt="Logo" width={79} height={79}/></Link>
                    <p className="text-[#FAFF00]">Añadir Evento</p>
                </div>            
                {/* <NavBar /> */}
            </div>
        </div>
    );
}

export default NavBar_Dashboard;