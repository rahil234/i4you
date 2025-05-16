import axios from 'axios';

export const fetchFacebookUser = async (token: string) => {
  try {
    const response = await axios.get('https://graph.facebook.com/me', {
      params: {
        fields: 'id,name,email,picture',
        access_token: token,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching Facebook user details:', error);
    return null;
  }
};
