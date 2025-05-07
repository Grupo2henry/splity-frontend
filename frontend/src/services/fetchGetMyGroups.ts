export const fetchGetMyGroups = async (token: string) => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/groups/my-groups`, {
            method: 'GET',
            headers: {'Content-Type': 'application/json', 'Accept': 'application/json', 'Authorization': `Bearer ${token}`},
        });
        const result = await response.json();
        return result;        
    } catch (error) {
        console.log(error);
    }
};

export default fetchGetMyGroups;