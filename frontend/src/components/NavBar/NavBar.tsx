"use client";

import Link from "next/link";
import Image from "next/image";

export const NavBar = () => {
    return (
        <nav className="w-full h-full flex flex-col justify-end">
            <ul className="flex justify-between w-full">
                <li className="flex flex-col items-center">
                    <Link href="/Dashboard"><Image src="/home.svg" alt="Logo" width={50} height={50}/></Link>
                    <p className="text-xs text-gray-500">Inicio</p>
                </li>
                <li className="flex flex-col items-center">
                    <Link href="/Dashboard"><Image src="/person.svg" alt="Logo" width={50} height={50}/></Link>
                    <p className="text-xs text-gray-500">Mi Cuenta</p>
                </li>
                <li className="flex flex-col items-center">
                    <Link href="/Dashboard"><Image src="/notifications.svg" alt="Logo" width={50} height={50}/></Link>
                    <p className="text-xs text-gray-500">Notificaciones</p>
                </li>
                <li className="flex flex-col items-center">
                    <Link href="/Dashboard"><Image src="/contact_support.svg" alt="Logo" width={50} height={50}/></Link>
                    <p className="text-xs text-gray-500">Ayuda</p>
                </li>
            </ul>
        </nav>
    );
};

export default NavBar;