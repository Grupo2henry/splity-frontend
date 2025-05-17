"use client";

import styles from "./NavBar.module.css";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useMembership } from "@/context/MembershipContext";
import CardProfile from "@/components/Card_Profile/Card_Profile";
import { useState, useEffect, useRef } from "react";
import ProfileBoard from "@/components/Profile_Board/Profile_Board"; // Importa Profile_Board

export default function NavBar() {
  const { user, logout } = useAuth();
  const { setActualGroupMembership } = useMembership();
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);

  const handleLogout = () => {
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
              src="/Logo-splity.png"
              alt="Splity Logo"
              width={60}
              height={20}
            />
          </Link>
          <nav className="flex items-center">
            <ul className={styles.navList}>
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
        <button 
          onClick={handleLogout} 
          className="mt-4 w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded">
            Cerrar sesión
        </button>
      </div>
    </>
  );
}