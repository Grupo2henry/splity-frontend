export const fetchExpenses = async (groupId: number) => {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('No authentication token found');
        }

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/groups/${groupId}/expenses`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        });

        if (!response.ok) {
            throw new Error('Failed to fetch expenses');
        }

        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Error fetching expenses:', error);
        throw error;
    }
};

export default fetchExpenses; 