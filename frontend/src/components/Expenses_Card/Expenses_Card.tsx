"use client"

import Image from "next/image";
import { useEffect, useState } from "react";
import fetchGetGroup from "@/services/fetchGetGroup";
import { group } from "@/components/Add_Expenses/types";
import { formatDate } from "./dateFuntion";

export const Expenses_Card = ({slugNumber} : {slugNumber: number}) => {

    const [group, setGroup] = useState<group | null>(null);
    const [grouped, setGrouped] = useState<Record<string, group["expenses"]>>({});

    const totalExpenses = group?.expenses.map((expense) => expense.amount).reduce((a, b) => a + b, 0);
    const totalPaid = group?.expenses.filter((expense) => expense.paid_by.id === group?.created_by.id).map((expense) => expense.amount).reduce((a, b) => a + b, 0);

    useEffect(() => {
        const getGroup = async () => {
            try {
            const response = await fetchGetGroup(slugNumber);
            setGroup(response);
            console.log(response);
            const groupedByDate: Record<string, group["expenses"]> = {};
            for (const expense of response.expenses || []) {
                const date = formatDate(expense.date.toString());
                if (!groupedByDate[date]) {
                    groupedByDate[date] = [];
                }
                groupedByDate[date].push(expense);
            };
            setGrouped(groupedByDate);
            } catch (error) {
            console.error("Error fetching group:", error);
            }
        };
        if (slugNumber) getGroup();
    }, [slugNumber]);
    
    return (
        <>
            <div className="flex w-full h-full items-center justify-between mb-6">
                <div className="flex flex-col gap-2">
                    <p className="text-[16px] text-[#FFFFFF] text-center">Mis gastos</p>
                    <div className="flex flex-col rounded-lg bg-[#61587C] gap-2 p-2">
                        <p className="custom-input font-bold">AR$ {totalPaid}</p>
                    </div>
                </div>  
                <div className="flex flex-col gap-2">
                    <p className="text-[16px] text-[#FFFFFF] text-center">Gastos grupales</p>
                    <div className="flex flex-col rounded-lg bg-[#61587C] gap-2 p-2">
                        <p className="custom-input font-bold">AR$ {totalExpenses}</p>
                    </div>
                </div>
            </div>
            <div className="flex flex-col w-full h-full items-center">
                <div className="flex flex-col w-full gap-6">
                    {Object.entries(grouped).map(([date, expenses]) => (
                        <div key={date} className="flex flex-col gap-1 ">
                            <p className="text-[16px] text-start text-[#FFFFFF]">{date}</p>
                            <div className="rounded-lg bg-[#61587C] p-2 gap-2 flex flex-col w-full">
                                {expenses.map((expense, index) => (
                                <div key={index} className="flex flex-col w-full">
                                    <div className="flex flex-col w-full px-2 bg-[#d9d9d9] rounded-lg" >
                                        <div className="flex flex-row justify-between items-center">
                                            <Image src="/image7.svg" alt="Logo" width={25} height={25}/>
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
                                ))}
                             </div>
                        </div>
                    ))}                    
                </div>
            </div>
        </>      
    );
}

export default Expenses_Card;