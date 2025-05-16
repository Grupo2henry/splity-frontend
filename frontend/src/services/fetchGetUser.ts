export const fetchGetUser = async (token: string) => {
<<<<<<< HEAD
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/me`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    const result = await response.json();
    return result;
  } catch (error) {
    console.log(error);
  }
};

export default fetchGetUser;
=======
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/me`, {
    method: 'GET',
    headers: {'Content-Type': 'application/json', 'Accept': 'application/json', 'Authorization': `Bearer ${token}`},
  });

  if (!response.ok) {
    const result = await response.json();
    throw new Error(result.message || `Error: ${response.status}`);
  }
  return await response.json();
};
>>>>>>> develop
