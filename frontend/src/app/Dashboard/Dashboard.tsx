import Image from "next/image";
import NavBar_Dashboard from "../../components/NavBar/NavBar_Dashboard/NavBar_Dashboard";
import Card_Dashboard from "@/components/Card_Dashboard/Card_Dashboard";

export const Dashboard = () => {
    return (
        <div className="divDashboard flex flex-col w-full h-full items-center ">
            {/* <Image src="/logo-splity.png" alt="Logo" width={165} height={175}/> */}
            <Card_Dashboard/>
            <NavBar_Dashboard/>
        </div>
    );
}

export default Dashboard;