//import Image from "next/image";
import Event_Form from "@/components/Event_Form/Event_Form";
//import NavBar from "@/components/NavBar/NavBar";

export const Create_Event = () => {
    return (
        <div className="flex flex-col w-full h-full items-center">
            {/* <Image src="/logo-splity.png" alt="Logo" width={165} height={175}/> */}
            <Event_Form />
            {/* <NavBar /> */}
        </div>
    );
};

export default Create_Event;