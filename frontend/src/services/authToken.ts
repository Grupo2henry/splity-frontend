export const getAuthToken = () => {
    return typeof window !== "undefined" ? localStorage.getItem("authToken") : null;
  };
  
  export const clearAuthToken = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("authToken");
    }
  };