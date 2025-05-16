//import Image from "next/image";
import CheckoutButton from "@/components/Checkout_Button/Checkout_Button";
import NavBar_Dashboard from "../../components/NavBar/NavBar_Dashboard/NavBar_Dashboard";
import Card_Dashboard from "@/components/Card_Dashboard/Card_Dashboard";

export const Dashboard = () => {
  return (
    <div className="divDashboard flex flex-col w-full h-full items-center p-4">
      <Card_Dashboard />
      <NavBar_Dashboard />
      <CheckoutButton />
    </div>
  );
};

export default Dashboard;