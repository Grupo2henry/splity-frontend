"use client";

import CheckoutButton from "@/components/Checkout_Button/Checkout_Button";
import NavBar_Dashboard from "@/components/NavBar/NavBar_Dashboard/NavBar_Dashboard";
import Card_Dashboard from "@/components/Card_Dashboard/Card_Dashboard";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Loader from "@/components/Loader/Loader";
import Button from "@/components/Button/Button";

export const Dashboard = () => {
  const { user, loading, userValidated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!userValidated && !loading) {
      router.push("/Login");
    }
  }, [userValidated, loading, router]);

  if (loading) {
    return <Loader isLoading={true} message="Verificando tu sesión..." />;
  }

  if (!userValidated) {
    return <div>Redirigiendo a Login...</div>;
  }

  if (!user) {
    return null;
  }

  // Lógica para bloquear si no es premium y ya creó 3 grupos
  const shouldBlockFeatures = !user.is_premium && user.total_groups_created >= 3;

  return (
    <div className="divDashboard flex flex-col w-full h-full items-center p-4 relative">
      <Card_Dashboard />

      {shouldBlockFeatures && (
        <>
          <Button color="bg-yellow-500">
            <CheckoutButton />
          </Button>

          <div className="w-full max-w-md bg-black/50 rounded-lg p-6 text-center mt-4">
            <p className="text-white text-lg font-semibold">
              Debes adquirir la versión premium para crear más grupos.
            </p>
          </div>
        </>
      )}

      {!shouldBlockFeatures && <NavBar_Dashboard />}
    </div>
  );
};

export default Dashboard;
