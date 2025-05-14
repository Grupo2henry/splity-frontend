"use client";

import styles from "./NavBar.module.css";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import CardProfile from "@/components/Card_Profile/Card_Profile";
import { useState } from "react";

export default function NavBar() {
  const { user, logout } = useAuth();
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setIsProfileMenuOpen(false); // Cerrar el menú después de cerrar sesión
  };

  const toggleProfileMenu = () => {
    setIsProfileMenuOpen(!isProfileMenuOpen);
  };

  return (
    <header className={styles.navbar}>
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="flex items-center">
          <Image src="/Logo-splity.png" alt="Splity Logo" width={60} height={20} />
        </Link>
        <nav className="flex items-center">
          <ul className={styles.navList}>
            <li><Link href="/" className={styles.navLink}>Home</Link></li>

            {/* Renderiza solo si el usuario está logueado */}
            {user && (
              <li>
                <Link href="/Dashboard" className={styles.navLink}>Dashboard</Link>
              </li>
            )}

            {/* Renderiza solo si el usuario NO está logueado */}
            {!user && (
              <>
                <li>
                  <Link href="/Login" className={styles.navLink}>Login</Link>
                </li>
                <li>
                  <Link href="/Register" className={styles.navLink}>Register</Link>
                </li>
              </>
            )}
          </ul>

          {/* Menú de perfil */}
          {user && (
            <div className="relative ml-4">
              <CardProfile onToggle={toggleProfileMenu} />
              {isProfileMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-xl z-10">
                  <div className="py-1">
                    <div className="px-4 py-2 text-sm text-gray-700">
                      ¡Hola, {user.name || user.username}!
                    </div>
                    <div className="px-4 py-2 text-sm text-gray-700">
                      {user.email}
                    </div>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 text-gray-700 focus:outline-none"
                    >
                      Cerrar Sesión
                    </button>
                    {/* Puedes agregar más opciones al menú aquí */}
                  </div>
                </div>
              )}
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}