"use client";

import styles from "./NavBar.module.css";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useMembership } from "@/context/MembershipContext";
import CardProfile from "@/components/Cards/ProfileCard/ProfileCard";
import { useState, useEffect, useRef } from "react";
import ProfileBoard from "@/components/Boards/ProfileBoard/ProfileBoard"; // Importa Profile_Board

export default function NavBar() {
  const { user, logout } = useAuth();
  const { setActualGroupMembership } = useMembership();
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);

  const handleLogout = () => {
    console.log("Se quito la membresia")
    setActualGroupMembership(null);
    logout();
    setIsProfileMenuOpen(false);
  };

  const toggleProfileMenu = () => {
    setIsProfileMenuOpen((prev) => !prev);
  };

  // Cerrar sidebar al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target as Node)
      ) {
        setIsProfileMenuOpen(false);
      }
    };

    if (isProfileMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isProfileMenuOpen]);

  return (
    <>
      <header className={styles.navbar}>
        <div className="container mx-auto flex justify-between items-center">
          <Link href="/" className="flex items-center">
            <Image
              src="https://res.cloudinary.com/dn52ctfur/image/upload/v1747872409/logo-splity_squ2hv.png"
              alt="Splity Logo"
              width={60}
              height={20}
            />
          </Link>
          <nav className="flex items-center">
            <ul className={styles.navList}>
              {user && (
                <li className="flex items-center">
                  <Link 
                    href="/subscription" 
                    className={`${styles.navLink} bg-transparent text-white px-3 py-1 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center gap-2 border border-[#7FFFD4] shadow-[0_0_10px_rgba(127,255,212,0.3)] hover:shadow-[0_0_15px_rgba(127,255,212,0.5)] hover:border-[#A0FFE6] text-xs transform-none hover:transform-none`}
                  >
                    Suscribirse
                  </Link>
                </li>
              )}
              <li>
                <Link href="/" className={styles.navLink}>
                  Home
                </Link>
              </li>
              {user && (
                <li>
                  <Link href="/Dashboard" className={styles.navLink}>
                    Dashboard
                  </Link>
                </li>
              )}
              {!user && (
                <>
                  <li>
                    <Link href="/Login" className={styles.navLink}>
                      Login
                    </Link>
                  </li>
                  <li>
                    <Link href="/Register" className={styles.navLink}>
                      Register
                    </Link>
                  </li>
                </>
              )}
            </ul>

            {user && (
              <div className="ml-4">
                <CardProfile onToggle={toggleProfileMenu} />
              </div>
            )}
          </nav>
        </div>
      </header>

      {/* Sidebar flotante */}
      <div
        ref={sidebarRef}
        className={`fixed top-0 right-0 h-screen w-[400px] bg-gray-100 shadow-lg z-50 transition-transform duration-300 ease-in-out ${
          isProfileMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Botón cerrar (X) */}
        <button
          onClick={() => setIsProfileMenuOpen(false)}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-xl font-bold focus:outline-none"
          aria-label="Cerrar menú de perfil"
        >
          &times;
        </button>

        <div className="p-6 mt-10">
          {user && <ProfileBoard />} {/* Renderiza el ProfileBoard si el usuario está autenticado */}
        </div>
        <div className="flex gap-2 px-6">
          <button 
            onClick={() => {
              const profileBoard = document.querySelector('[data-profile-board]');
              if (profileBoard) {
                const event = new CustomEvent('editProfile');
                profileBoard.dispatchEvent(event);
              }
            }} 
            className="mt-4 flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 rounded flex items-center justify-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
            Editar
          </button>
          <button 
            onClick={handleLogout} 
            className="mt-4 flex-1 bg-red-500 hover:bg-red-600 text-white py-2 rounded">
              Cerrar sesión
          </button>
        </div>
      </div>
    </>
  );
}