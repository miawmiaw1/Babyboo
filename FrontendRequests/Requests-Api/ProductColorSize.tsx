export interface ProductColorSize {
    productId: number; // Corresponds to productid in the table
    colorId: number;   // Corresponds to colorid in the table
    sizeId: number;    // Corresponds to sizeid in the table
    quantity: number;  // Corresponds to quantity in the table
  }

interface ApiResponse {
    result: boolean,
    message?: string;
    data?: any;
}

export async function UpdateProductColorSizeQuantity(colorid: number, sizeid: number, quantity: number, productid: number): Promise<ApiResponse> {
    try {
        const response = await fetch(`/api/productColorSize/UpdateProductColorSizeQuantity?colorid=${colorid}&sizeid=${sizeid}&productid=${productid}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({quantity: quantity}),
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Error:', errorData.error);
            return { result: false, message: errorData, data: [] };
        }

        const productcolorsize: ProductColorSize[] = await response.json();
        return { result: true, message: 'Productcolorsize updated', data: productcolorsize};

    } catch (error) {
        console.error('Productcolorsize failed:', error);
        return { result: false, message: "", data: null };
    }
}

export async function GetProductColorSizeById(colorid: number, sizeid: number, productid: number): Promise<ApiResponse> {
    try {
        const response = await fetch(`/api/productColorSize/GetProductColorSizeById?colorid=${colorid}&sizeid=${sizeid}&productid=${productid}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Error fetching Productcolorsize:', errorData.error);
            return { result: false, message: errorData.error, data: null };
        }

        const productcolorsize: ProductColorSize = await response.json();
        return { result: true, message: 'Productcolorsize FETCHED', data: productcolorsize};

    } catch (error) {
        console.error('Failed to fetch Productcolorsize:', error);
        return { result: false, message: "", data: null };
    }
}