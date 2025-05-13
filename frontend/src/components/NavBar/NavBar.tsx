"use client";

import styles from "./NavBar.module.css";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { clearAuthToken } from "../../services/authToken";
import { useUser } from "@/context/UserContext";

export default function NavBar() {
  const router = useRouter();
  const { user, setUser } = useUser(); // obtenés el estado del usuario

  const handleLogout = () => {
  clearAuthToken();   // borra token del localStorage
  setUser(null);
  console.log(localStorage.getItem('token'))      // borra el estado del usuario
  router.push("/Login"); // redirige
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
