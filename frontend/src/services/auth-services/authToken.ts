export const getAuthToken = () => {
    return typeof window !== "undefined" ? localStorage.getItem("token") : null;
  };
  
  export const clearAuthToken = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
    }
  };