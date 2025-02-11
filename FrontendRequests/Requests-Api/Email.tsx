export interface SendOrderParams {
    email: string;
    pdfbase64: string;
    Filename: string;
}

interface ApiResponse {
    result: boolean;
    message?: string;
    data?: any;
}

export async function SendOrderEmail({ email, pdfbase64, Filename }: SendOrderParams): Promise<ApiResponse> {
    try {

        const response = await fetch(`/api/email/SendOrder`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({email: email, pdfbase64: pdfbase64, Filename: Filename}),
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Error:', errorData.error);
            return { result: false, message: errorData.error, data: null };
        }

        const message = await response.json();
        return { result: true, message: 'Email sent', data: message };
    } catch (error) {
        console.error('Request failed:', error);
        return { result: false, message: "", data: null };
    }
}

export async function SendEmailToOwner(email:string, text:string, subject:string): Promise<ApiResponse> {
    try {

        const response = await fetch(`/api/email/SendMessageToOwner`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({email: email, text: text, subject: subject}),
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Error:', errorData.error);
            return { result: false, message: errorData.error, data: null };
        }

        const message = await response.json();
        return { result: true, message: 'Email sent', data: message };
    } catch (error) {
        console.error('Request failed:', error);
        return { result: false, message: "", data: null };
    }
}

export async function SendMesssage(email:string, text:string, subject:string): Promise<ApiResponse> {
    try {

        const response = await fetch(`/api/email/SendMessage`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({email: email, text: text, subject: subject}),
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Error:', errorData.error);
            return { result: false, message: errorData.error, data: null };
        }

        const message = await response.json();
        return { result: true, message: 'Email sent', data: message };
    } catch (error) {
        console.error('Request failed:', error);
        return { result: false, message: "", data: null };
    }
}