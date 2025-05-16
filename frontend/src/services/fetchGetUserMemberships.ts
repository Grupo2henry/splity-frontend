export const fetchGetUserMemberships = async (token: string) => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/me/memberships}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`
            },
        });
    if (!response.ok) {
        const errorBody = await response.json();
        throw new Error(errorBody.message || `Error al obtener membresias`);
        }
    return await response.json();
};