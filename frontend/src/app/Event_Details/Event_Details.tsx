import Image from "next/image";
import {NavBar_Event_Details} from "@/components/NavBar/NavBar_Event_Details/NaBar_Event_Details";
import Expenses_Card from "@/components/Expenses_Card/Expenses_Card";
export const Event_Details = () => {
    return (
        <div className="flex flex-col w-full h-full items-center">
            <Image src="/logo-splity.png" alt="Logo" width={165} height={175} />
            <Expenses_Card />
            <NavBar_Event_Details />
        </div>
    );
};

export default Event_Details;
