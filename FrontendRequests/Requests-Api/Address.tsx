export interface Address {
    addressid: number;
    address: string;
    postalcode: number;
    city: string;
    countryid: number;
}

interface ApiResponse {
    result: boolean,
    message?: string;
    data?: any;
}

export async function CreateAddress(address: string, postalcode: number, city: string, countryid: number): Promise<ApiResponse> {
    try {
        const response = await fetch(`/api/address/CreateAddress`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ address, postalcode, city, countryid }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Error:', errorData.error);
            return { result: false, message: errorData, data: null };
        }

        const data = await response.json();
        return { result: true, message: '', data: data };

    } catch (error) {
        console.error('Request failed:', error);
        return { result: false, message: "", data: null };
    }
}

export async function UpdateAddress(
    id: number,
    address: string,
    postalcode: number,
    city: string,
    countryid: number
): Promise<ApiResponse> {
    try {
        const response = await fetch(`/api/address/UpdateAddress?id=${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ address, postalcode, city, countryid }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Error:', errorData.error);
            return { result: false, message: errorData.error, data: null };
        }

        const data = await response.json();
        return { result: true, message: 'Address updated successfully', data };

    } catch (error) {
        console.error('Request failed:', error);
        return { result: false, message: 'Request failed', data: null };
    }
}
