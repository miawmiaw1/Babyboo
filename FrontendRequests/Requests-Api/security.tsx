  interface ApiResponse {
    result: boolean,
    message?: string;
  }
  
  export const Verifytoken = async (authtoken: string): Promise<ApiResponse> => {
    if (authtoken) {
      const response = await fetch('/api/security/verifyToken', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${authtoken}`
        }
      });
      if (response.ok) {
        return { result: true, message: "Token verified" };
      } else {
        return { result: false, message: "Token not verified" };
      }
    } else {
      return { result: false, message: "Token not verified" };
    }
  };