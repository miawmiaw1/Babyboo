export interface Country {
    countryid: number;
    country: string;
}

interface ApiResponse {
    result: boolean,
    message?: string;
    data?: any;
}

export async function FetchAllCountry(): Promise<ApiResponse> {
    try {
        const response = await fetch(`/api/country/GetCountries`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Error:', errorData.error);
            return { result: false, message: errorData, data: [] };
        }

        const countries: Country[] = await response.json();
        return { result: true, message: 'Countries fetched', data: countries};

    } catch (error) {
        console.error('Request failed:', error);
        return { result: false, message: "", data: null };
    }
}