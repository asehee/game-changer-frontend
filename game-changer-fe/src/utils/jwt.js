import { jwtDecode } from "jwt-decode";

export const checkSessionExpiration = (expiresAt) => {
  const expirationTime = new Date(expiresAt).getTime();
  const currentTime = Date.now();
  
  return currentTime < expirationTime;
};

export const getTokenPayload = (sessionToken) => {
  try {
    return jwtDecode(sessionToken);
  } catch (error) {
    console.error('Error decoding JWT token:', error);
    return null;
  }
};