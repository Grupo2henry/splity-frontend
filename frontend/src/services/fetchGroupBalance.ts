export const fetchGroupBalance = async (groupId: string) => {
    const token = localStorage.getItem('token');
    if (!token) {
        throw new Error("No hay token disponible. El usuario no está autenticado.");
      }
    try{
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/groups/${groupId}/equal-division`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json', 
                'Accept': 'application/json', 
                'Authorization': `Bearer ${token}`
            },
        });
        const result = await response.json();
        return result;
    }catch(error){
        console.log(error);
    }
}