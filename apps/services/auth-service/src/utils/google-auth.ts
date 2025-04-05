import axios from 'axios';

const fetchGoogleUser = async (token: string) => {
  try {
    const response = await axios.get(
      'https://www.googleapis.com/oauth2/v3/userinfo',
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching user details:', error);
    return null;
  }
};

export default fetchGoogleUser;
