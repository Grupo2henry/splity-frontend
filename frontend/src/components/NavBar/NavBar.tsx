"use client";

import styles from "./NavBar.module.css";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

export default function NavBar() {
  const { user, logout } = useAuth(); // Obtenemos el estado del usuario y la función logout

  const handleLogout = () => {
    logout(); // Llama a la función logout del AuthContext
  };

  return (
    <header className={styles.navbar}>
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="flex items-center">
          <Image src="/Logo-splity.png" alt="Splity Logo" width={60} height={20} />
        </Link>
        <nav>
          <ul className={styles.navList}>
            <li><Link href="/" className={styles.navLink}>Home</Link></li>

            {/* Renderiza solo si el usuario está logueado */}
            {user && (
              <>
                <li>
                  <Link href="/Dashboard" className={styles.navLink}>Dashboard</Link>
                </li>
                <li>
                  <button onClick={handleLogout} className={styles.navLink}>
                    Cerrar Sesión
                  </button>
                </li>
              </>
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
        </nav>
      </div>
    </header>
  );
}