"use client"

import Image from "next/image";
import { useEffect, useState } from "react";
import fetchGetGroup from "@/services/fetchGetGroup";
import { group } from "@/components/Add_Expenses/types";
import { formatDate } from "./dateFuntion";

export const Expenses_Card = ({slugNumber} : {slugNumber: number}) => {

    const [group, setGroup] = useState<group | null>(null);

    useEffect(() => {
        const getGroup = async () => {
            try {
            const response = await fetchGetGroup(slugNumber);
            console.log(response.expenses);
            setGroup(response);
            } catch (error) {
            console.error("Error fetching group:", error);
            }
        };

        if (slugNumber) getGroup();
    }, [slugNumber]);
    
    return (
            <div className="flex flex-col w-full h-full items-center">
                <div className="flex flex-col w-full gap-6">
                    {group?.expenses.map((expense, index) => (
                        <div key={index} className="flex flex-col gap-1 ">
                            <p className="text-[16px] text-start text-[#FFFFFF]">{formatDate(expense.date.toString())}</p>
                            <div className="rounded-lg bg-[#61587C] p-2">
                                <div className="flex flex-col w-full ">
                                    <div className="flex flex-col w-full px-2 bg-[#d9d9d9] rounded-lg" >
                                        <div className="flex flex-row justify-between items-center">
                                            <Image src="/image1.svg" alt="Logo" width={25} height={25}/>
                                            <div className="flex w-full gap-2">
                                                <div className="flex flex-col w-full ml-2">
                                                    <p className="font-bold">{expense.description}</p>
                                                    <p className="text-sm">Pagado por {expense.paid_by.name}</p>
                                                </div>
                                                <p className="font-bold text-md">AR${expense.amount}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                             </div>
                        </div>
                    ))}                    
                </div>
            </div>      
    );
}

export default Expenses_Card;