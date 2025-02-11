import type { ExtendedBasketProduct } from "../../src/components/NotifcationSystem/NotificationContext";
import type { checkoutaddress, checkoutcontact, CheckoutDeliveryOption } from "../Interfaces/Checkout";

export interface stripe {
    amount: number;
    currency: string;
}

export interface stripecheckout {
    userId: number;
    parceladdress: string;
    isHomeDelivery: boolean;
    products: ExtendedBasketProduct[];
    contactInfo: checkoutcontact;
    addressinfo: checkoutaddress;
    deliveryAddress: CheckoutDeliveryOption;
}

interface ApiResponse {
    result: boolean,
    message?: string;
    data?: any;
}

export async function CreatepaymentIntent(stripe : stripe): Promise<ApiResponse> {
    try {
        const response = await fetch(`/api/stripe/CreatepaymentIntent`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(stripe as stripe),
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