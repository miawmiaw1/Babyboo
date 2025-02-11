export interface Sizes {
    sizeid: number;
    sizename: string;
}

interface ApiResponse {
    result: boolean,
    message?: string;
    data?: any;
}

export async function GetAllSizes(): Promise<ApiResponse> {
    try {
        const response = await fetch(`/api/size/GetSizes`, {
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

        const sizes: Sizes[] = await response.json();
        return { result: true, message: 'Sizes fetched', data: sizes };

    } catch (error) {
        console.error('Request failed:', error);
        return { result: false, message: "", data: null };
    }
}

export async function CreateSize(sizename: string): Promise<ApiResponse> {
    try {
        const response = await fetch(`/api/size/CreateSize`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ sizename })
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Error:', errorData.error);
            return { result: false, message: errorData, data: null };
        }

        const newSize: Sizes = await response.json();
        return { result: true, message: 'Size created', data: newSize };

    } catch (error) {
        console.error('Request failed:', error);
        return { result: false, message: "", data: null };
    }
}

export async function GetSizeById(id: number): Promise<ApiResponse> {
    try {
        const response = await fetch(`/api/size/GetSizeById?id=${id}`, {
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

        const size: Sizes = await response.json();
        return { result: true, message: 'Size fetched', data: size };

    } catch (error) {
        console.error('Request failed:', error);
        return { result: false, message: "", data: null };
    }
}

export async function UpdateSize(id: number, sizename: string): Promise<ApiResponse> {
    try {
        const response = await fetch(`/api/size/UpdateSize?id=${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ sizename })
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Error:', errorData.error);
            return { result: false, message: errorData, data: null };
        }

        const updatedSize: Sizes = await response.json();
        return { result: true, message: 'Size updated', data: updatedSize };

    } catch (error) {
        console.error('Request failed:', error);
        return { result: false, message: "", data: null };
    }
}

export async function DeleteSize(id: number): Promise<ApiResponse> {
    try {
        const response = await fetch(`/api/size/DeleteSize?id=${id}`, {
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

        return { result: true, message: 'Size deleted', data: null };

    } catch (error) {
        console.error('Request failed:', error);
        return { result: false, message: "", data: null };
    }
}