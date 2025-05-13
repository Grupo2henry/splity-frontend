import { IFormGasto } from "@/components/Add_Expenses/types";

export const fetchCreateExpense = async (data: IFormGasto, slugNumber: number) => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/groups/${slugNumber}/expenses`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json', 'Accept': 'application/json'},
            body: JSON.stringify(data),
        });
        const result = await response.json();
        return result;        
    } catch (error) {
        console.log(error);        
    }
};

export default fetchCreateExpense;