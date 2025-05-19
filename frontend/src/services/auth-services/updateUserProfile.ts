interface UpdateUserProfileData {
  name: string;
  email: string;
  profile_picture_url: string;
}

export const updateUserProfile = async (data: UpdateUserProfileData, token: string, userId: string) => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/${userId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || `Error updating profile: ${response.status}`);
  }

  return await response.json();
};

export default updateUserProfile; 