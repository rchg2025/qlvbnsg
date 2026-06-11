import Cookies from 'js-cookie'; 
import { jwtDecode } from 'jwt-decode'; 

export const isAdmin = () => {
  const token = Cookies.get('accessToken'); 
  if (!token) return false;

  try {
    const decodedToken = jwtDecode(token); 
    return decodedToken.role === 'admin' || decodedToken.role === 'manager';
  // eslint-disable-next-line no-unused-vars
  } catch (error) {
    return false;
  }
};
