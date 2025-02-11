export interface Color {
    colorid: number;
    colorname: string;
}

interface ApiResponse {
    result: boolean,
    message: string;
    data?: any;
}


export async function GetAllColors(): Promise<ApiResponse> {
    try {
        const response = await fetch(`/api/color/GetColors`, {
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

        const colors: Color[] = await response.json();
        return { result: true, message: 'Colors fetched', data: colors };

    } catch (error) {
        console.error('Request failed:', error);
        return { result: false, message: "", data: null };
    }
}

export async function CreateColor(colorname: string): Promise<ApiResponse> {
    try {
        const response = await fetch(`/api/color/CreateColor`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ colorname })
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Error:', errorData.error);
            return { result: false, message: errorData, data: null };
        }

        const newColor: Color = await response.json();
        return { result: true, message: 'Color created', data: newColor };

    } catch (error) {
        console.error('Request failed:', error);
        return { result: false, message: "", data: null };
    }
}

export async function GetColorById(id: number): Promise<ApiResponse> {
    try {
        const response = await fetch(`/api/color/GetColorById?id=${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Error:', errorData.error);
            return { result: false, message: errorData, data: null };
        }

        const color: Color = await response.json();
        return { result: true, message: 'Color fetched', data: color };

    } catch (error) {
        console.error('Request failed:', error);
        return { result: false, message: "", data: null };
    }
}

export async function UpdateColor(id: number, colorname: string): Promise<ApiResponse> {
    try {
        const response = await fetch(`/api/color/UpdateColor?id=${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ colorname })
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Error:', errorData.error);
            return { result: false, message: errorData, data: null };
        }

        const updatedColor: Color = await response.json();
        return { result: true, message: 'Color updated', data: updatedColor };

    } catch (error) {
        console.error('Request failed:', error);
        return { result: false, message: "", data: null };
    }
}

export async function DeleteColor(id: number): Promise<ApiResponse> {
    try {
        const response = await fetch(`/api/color/DeleteColor?id=${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Error:', errorData.error);
            return { result: false, message: errorData, data: null };
        }

        return { result: true, message: 'Color deleted', data: null };

    } catch (error) {
        console.error('Request failed:', error);
        return { result: false, message: "", data: null };
    }
}