import type { Product } from "./Product";

export interface OrdersProduct {
    orderid: number;     // ID of the order
    productid: number;
    productname: string;
    colorname: string;
    sizename: string;
    quantity: number;
    købspris_ex_moms: number;
    salgpris_ex_moms: number;
    indgående_moms: number;
    udgående_moms: number;
}

export interface Order {
    orderid: number;
    order_date: string; // Using string to represent dates in ISO format
    firstname: string;
    lastname: string;
    email: string;
    phonenumber?: number;
    address: string;
    postalcode: number;
    city: string;
    country: string;
    parcel: string;
    ishomedelivery: boolean;
    totalprice: number;
    stripepaymentid: string;
    userid: number;
    statusid: number;
    statusname?: string;
    paymentid: number;
    paymentname?: string;
    order_products: OrdersProduct[];
    products?: Product[];
}

interface ApiResponse {
    result: boolean;
    message?: string;
    data?: any;
    authtoken?: string
}

export async function FetchAllOrders(): Promise<ApiResponse> {
    try {
        const response = await fetch(`/api/order/GetOrders`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Error:', errorData.error);
            return { result: false, message: errorData.error, data: [] };
        }

        const orders: Order[] = await response.json();
        return { result: true, message: 'Orders fetched successfully', data: orders };
    } catch (error) {
        console.error('Request failed:', error);
        return { result: false, message: "", data: null };
    }
}

export async function FetchOrderById(orderid: string): Promise<ApiResponse> {
    try {
        const response = await fetch(`/api/order/FetchOrderById?id=${orderid}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Error:', errorData.error);
            return { result: false, message: errorData.error, data: null };
        }
        const order: Order = await response.json();
        return { result: true, message: 'Order fetched successfully', data: order };
    } catch (error) {
        console.error('Request failed:', error);
        return { result: false, message: "", data: null };
    }
}

export async function FetchOrdersByUserId(userid: string): Promise<ApiResponse> {
    try {
        const response = await fetch(`/api/order/FetchOrdersByUserId?id=${userid}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Error:', errorData.error);
            return { result: false, message: errorData.error, data: [] };
        }

        const orders: Order[] = await response.json();
        return { result: true, message: 'Orders fetched successfully', data: orders };
    } catch (error) {
        console.error('Request failed:', error);
        return { result: false, message: "", data: null };
    }
}

export async function CreateOrder(order: Order): Promise<ApiResponse> {
    try {
        const response = await fetch(`/api/order/CreateOrder`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(order),
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Error:', errorData.error);
            return { result: false, message: errorData.error, data: null };
        }

        const data = await response.json();
        const newOrder = data.order;
        return { result: true, message: 'Order created successfully', data: newOrder, authtoken: data.jwt };
    } catch (error) {
        console.error('Request failed:', error);
        return { result: false, message: "", data: null };
    }
}

export async function UpdateOrder(orderid: number, updatedOrder: Omit<Order, 'orderid'>): Promise<ApiResponse> {
    try {
        const response = await fetch(`/api/order/UpdateOrder?id=${orderid}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedOrder),
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Error:', errorData.error);
            return { result: false, message: errorData.error, data: null };
        }

        const updated: Order = await response.json();
        return { result: true, message: 'Order updated successfully', data: updated };
    } catch (error) {
        console.error('Request failed:', error);
        return { result: false, message: "", data: null };
    }
}

export async function DeleteOrder(orderid: number): Promise<ApiResponse> {
    try {
        const response = await fetch(`/api/order/DeleteOrder?id=${orderid}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Error:', errorData.error);
            return { result: false, message: errorData.error, data: null };
        }

        return { result: true, message: 'Order deleted successfully', data: null };
    } catch (error) {
        console.error('Request failed:', error);
        return { result: false, message: "", data: null };
    }
}