export const fetchGetGroup = async (slug: number) => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/groups/id/${Number(slug)}`, {
            method: 'GET',
            headers: {'Content-Type': 'application/json', 'Accept': 'application/json'},
        });
        const result = await response.json();
        return result;        
    } catch (error) {
        console.log(error);
    }
};

export default fetchGetGroup;