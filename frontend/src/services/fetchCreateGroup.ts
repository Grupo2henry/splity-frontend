import { IFormEvent } from "@/components/Event_Form/types"; 

export const fetchCreateGroup = async (data: IFormEvent, token: string) => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/groups/`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json', 'Accept': 'application/json', 'Authorization': `Bearer ${token}`},
            body: JSON.stringify(data),
        });
        const result = await response.json();
        return result;        
    } catch (error) {
        console.log(error);        
    }
};

export default fetchCreateGroup;