import type { checkoutaddress } from "../Interfaces/Checkout";

interface ApiResponse {
    result: boolean,
    message?: string;
    data?: any;
}

export const fetchCoordinates = async (address: checkoutaddress): Promise<ApiResponse> => {
    if (!address.result) {
        return {
            result: false,
            message: "No address entered",
          };
    }

    const query = `${address.address}, ${address.postalcode} ${address.city}, DK`;
    const endpoint = `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(
        query
    )}&key=${import.meta.env.OPENCAGEAPIKEY}`;
  
    try {
      const response = await fetch(endpoint);
  
      if (!response.ok) {
        return {
          result: false,
          message: `HTTP error! status: ${response.status}`,
        };
      }
  
      const data = await response.json();
      const { results } = data;
  
      if (results && results.length > 0) {
        const { lat, lng } = results[0].geometry;
        const formattedAddress = results[0].formatted;
  
        return {
          result: true,
          data: {
            latitude: lat,
            longitude: lng,
            formattedAddress,
          },
        };
      } else {
        return {
          result: false,
          message: "No results found for the given address.",
        };
      }
    } catch (error) {
      return {
        result: false,
        message: error instanceof Error ? error.message : "An unknown error occurred.",
      };
    }
  };

export const fetchParcelShops = async (
    latitude: number,
    longitude: number,
    resultCountryCodes: string = "DK" // Default to Denmark
): Promise<ApiResponse> => {

    const apiUrl = "https://api-sandbox.gls-group.net/parcel-shop-management/v2/available-public-parcel-shops";
    const apiKey = import.meta.env.GLSAPIKEY;  // Replace with your actual API key

    try {
        // Construct query parameters using URLSearchParams
        const params = new URLSearchParams({
            country: resultCountryCodes,
            latitude: latitude.toString(),
            longitude: longitude.toString(),
            limit: "20",
        });

        const url = `${apiUrl}?${params.toString()}`;

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'ApiKey': apiKey,
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            const errorData = await response.json();
            return { result: false, message: errorData, data: null };
        }

        const data = await response.json();

        return { result: true, message: '', data: data };
    } catch (error: any) {
        return { result: false, message: error.message, data: [] };

    }
};