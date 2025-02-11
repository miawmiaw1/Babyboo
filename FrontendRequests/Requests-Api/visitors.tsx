interface Visitor {
    id: number;
    visit: number;
}

interface ApiResponse {
    result: boolean;
    message?: string;
    data?: Visitor;
}

export async function AddVisitor(): Promise<ApiResponse> {
    try {
        const response = await fetch(`/api/visitors/AddVisitor`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Error:', errorData.error);
            return { result: false, message: errorData.error, data: undefined };
        }

        const visitor: Visitor = await response.json();
        return { result: true, message: 'Visitor entry created or updated', data: visitor };
    } catch (error) {
        console.error('Request failed:', error);
        return { result: false, message: "", data: undefined };
    }
}

export async function GetVisitor(): Promise<ApiResponse> {
    try {
        const response = await fetch(`/api/visitors/GetVisitor`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Error:', errorData.error);
            return { result: false, message: errorData.error, data: undefined };
        }

        const visitor: Visitor = await response.json();
        return { result: true, message: 'Visitor entry fetched', data: visitor };
    } catch (error) {
        console.error('Request failed:', error);
        return { result: false, message: "", data: undefined };
    }
}

export async function DeleteVisitor(): Promise<ApiResponse> {
    try {
        const response = await fetch(`/api/visitors/DeleteVisitor`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Error:', errorData.error);
            return { result: false, message: errorData.error, data: undefined };
        }

        return { result: true, message: 'Visitor entry deleted', data: undefined };
    } catch (error) {
        console.error('Request failed:', error);
        return { result: false, message: "", data: undefined };
    }
}