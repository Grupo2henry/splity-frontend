"use client";

import Image from "next/image";
import {NavBar_Event_Details} from "@/components/NavBar/NavBar_Event_Details/NaBar_Event_Details";
import Expenses_Card from "@/components/Expenses_Card/Expenses_Card";
import {useParams} from "next/navigation";
import { useState } from "react";

export const Event_Details = () => {

    const [state, setState] = useState("Gastos");

    const { slug } = useParams();
    const slugNumber = Number(slug);
    
    return (
        <div className="flex flex-col w-full h-full items-center">            
            <Image src="/logo-splity.png" alt="Logo" width={165} height={175} />
            <div className="flex flex-col w-full h-full items-center mb-6 gap-2">
                <Image src="/image1.svg" alt="Logo" width={80} height={80}/>
                <p className="text-[16px] text-[#FFFFFF] text-center">Cena de viernes por la noche</p>
            </div>
            <div className="flex w-full h-full rounded-lg bg-[#61587C] gap-2 p-2 items-center justify-between mb-6">
                {["Gastos", "Saldos", "Comprobantes"].map((item) => (
                    <div key={item} className="flex w-1/3">
                        <button className={state === item ? "custom-input text-gray-700 font-bold" : "custom-input text-gray-400 font-bold"} onClick={() => setState(item)}>
                            {item}
                        </button>
                    </div>
                ))}
             </div>
             {state === "Gastos" && <Expenses_Card slugNumber={slugNumber} />}            
            <NavBar_Event_Details slugNumber={slugNumbenr} />            
        </div>
    );
};

export default Event_Details;
