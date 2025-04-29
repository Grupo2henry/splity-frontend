import Image from "next/image";
import Add_Expenses from "@/components/Add_Expenses/Add_Expenses";
import NavBar from "@/components/NavBar/NavBar";
export const Add_Spent = () => {
    return (
        <div className="flex flex-col w-full h-full items-center">
            <Image src="/logo-splity.png" alt="Logo" width={165} height={175} />
            <Add_Expenses />
            <NavBar />
        </div>
    );
};

export default Add_Spent;