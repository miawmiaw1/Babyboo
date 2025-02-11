export interface User {
  userid: number;     // SERIAL PRIMARY KEY
  username: string;
  firstname: string;  // VARCHAR(255) NOT NULL
  lastname: string;   // VARCHAR(255) NOT NULL
  password: string;   // VARCHAR(255) NOT NULL
  email: string;      // VARCHAR(255) UNIQUE NOT NULL
  phonenumber?: number; // BIGINT (optional)
  addressid?: number; // INT UNIQUE (optional)
  membertypeid?: number; // INT UNIQUE (optional)

  // Additional fields from the JOINs
  user_address?: string;        // Address from Address table
  address_postalcode?: number;  // Postal code from Address table
  address_city?: string;        // City from Address table
  country_name?: string;        // Country name from Country table
  member_type?: string;         // Member type from MemberType table
}

interface ApiResponse {
  result: boolean,
  message?: string;
  data?: any;
}

export const fetchUsers = async (): Promise<ApiResponse> => {
  const response = await fetch('/api/user/fetchUsers');
  if (!response.ok) {
    return { result: false, message: "Cannot fetch users", data: [] };
  }

  // Ensure the response is parsed as an array of User objects
  const users: User[] = await response.json();
  return { result: true, message: "Users fetched", data: users };
};

export const fetchUserById = async (id: number): Promise<ApiResponse> => {
  const response = await fetch(`/api/user/fetchUserById?id=${id}`);
  
  if (!response.ok) {
    return { result: false, message: "Cannot fetch user", data: null };
  }

  // Parse the JSON response as a User object
  const user: User = await response.json();
  return { result: true, message: "User fetched", data: user };
};

export const loginUser = async (email: string, password: string): Promise<Boolean> => {
  try {
      const response = await fetch(`/api/user/loginUser`, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
          return false
      }

      const data = await response.json();
      const token = data.token;

      // Store the token in localStorage
      localStorage.setItem('jwtToken', token);
      return true // Return the result and token
  } catch (error) {
      console.error('Login error:', error);
      return false // Return false and null token in case of error
  }
};

export const changepassword = async (id: string, kodeord: string, nykode: string): Promise<ApiResponse> => {
  try {
      const response = await fetch(`/api/user/changepassword?id=${id}`, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({ kodeord, nykode }),
      });

      if (!response.ok) {
        return { result: false, message: "Cannot change password", data: [] };
      }


      return { result: true, message: "Password changed", data: await response.json() };
  } catch (error) {
      console.error('Login error:', error);
      return { result: false, message: "Cannot change password", data: [] };
  }
};

export const RegisterUser = async (username: string, firstname: string, lastname: string,
  password: string, email: string, phonenumber: number, addressid: number, membertypeid: number): Promise<ApiResponse> => {
 try {
        const response = await fetch('/api/user/CreateUser', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, firstname, lastname, password, email, phonenumber, addressid, membertypeid }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            return { result: false, message: errorData, data: null };
        }

        const data = await response.json();
        return { result: true, message: "", data: data };

    } catch (error) {
        console.error('Request failed:', error);
        return { result: false, message: "Database error", data: null };
    }
};

export const UserExsistByEmail = async (email: string): Promise<ApiResponse> => {
  const response = await fetch(`/api/user/fetchUserByEmail?email=${email}`, {
    method: 'GET',
    headers: {
        'Content-Type': 'application/json'
    },
});

if (!response.ok) {
  const errorData = await response.json();
  return { result: false, message: errorData, data: null };
}

const data: User = await response.json();
return { result: true, message: "", data: data };
}

export const IsLoggedIn = async (): Promise<ApiResponse> => {
  const token = localStorage.getItem('jwtToken');
  if (token) {
    const response = await fetch('/api/user/verifyLogin', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    if (response.ok) {
      const data = await response.json();
      return { result: true, message: "User is logged in", data: data };
    } else {
      return { result: false, message: "User is not logged in", data: '' };
    }
  } else {
    return { result: false, message: "User is logged in", data: '' };
  }
};

export const UpdateUser = async ( user: User
): Promise<ApiResponse> => {
  try {
    const response = await fetch(`/api/user/UpdateUser?id=${user.userid}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(user),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return { result: false, message: errorData, data: null };
    }

    const data = await response.json();
    return { result: true, message: "User updated successfully", data };
  } catch (error) {
    console.error('Update error:', error);
    return { result: false, message: "Database error", data: null };
  }
};

export const deleteUser = async (id: number): Promise<ApiResponse> => {
  try {
    const response = await fetch(`/api/user/deleteUser?id=${id}`, {
      method: 'DELETE',
    });

    if (response.status === 204) {
      return { result: true, message: "User deleted successfully" };
    } else if (response.status === 404) {
      return { result: false, message: "User not found" };
    } else {
      const errorData = await response.json();
      return { result: false, message: errorData.error || "An error occurred" };
    }
  } catch (error) {
    console.error("Error deleting user:", error);
    return { result: false, message: "Server error" };
  }
};

export const RecoverUser = async (id: string): Promise<ApiResponse> => {
  try {
      const response = await fetch(`/api/user/recoverUser?id=${id}`, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          }
      });

      if (!response.ok) {
        return { result: false, message: "Cannot get new password", data: [] };
      }


      return { result: true, message: "New password generated", data: await response.json() };
  } catch (error) {
      console.error('Login error:', error);
      return { result: false, message: "Cannot get new password", data: [] };
  }
};
