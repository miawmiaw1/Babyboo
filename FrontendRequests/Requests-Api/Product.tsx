export interface ProductImage {
    imageid: number;
    productid: number;
    image_url: string;
    description?: string; // Optional field
    created_at?: string; // Optional field, assuming it's returned as a string in ISO format
}

export interface Category {
    categoryid: number;
    categoryname: string;
    categoryimage: string;
    categorydescription: string;
}


export interface ProductColorSize {
    colorid: number;  // Corresponds to colorid
    colorname?: string; // Corresponds to colorname
    sizeid: number;    // Corresponds to sizeid
    sizename?: string;  // Corresponds to sizename
    quantity: number;  // Corresponds to quantity
}

// Update the Product interface
export interface Product {
    productid: number;
    name: string;
    description: string;
    manufacturer: string;
    features: string;
    link: string;
    købspris_ex_moms: number;
    salgpris_ex_moms: number;
    indgående_moms: number;
    udgående_moms: number;
    tags: string;
    barcode: number;
    images: ProductImage[]; // Array of ProductImage objects
    productcolorsizes: ProductColorSize[];
    categories: Category[];
}

interface ApiResponse {
    result: boolean,
    message?: string;
    data?: any;
}

export async function GetAllProducts(): Promise<ApiResponse> {
    try {
        const response = await fetch(`/api/product/GetAllProducts`, {
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

        const countries: Product[] = await response.json();
        return { result: true, message: 'Products fetched', data: countries};

    } catch (error) {
        console.error('Request failed:', error);
        return { result: false, message: "", data: null };
    }
}

export const GetProduct = async (id: string): Promise<ApiResponse> => {
    const response = await fetch(`/api/product/GetProduct?id=${id}`);
    
    if (!response.ok) {
      return { result: false, message: "Cannot fetch Product", data: null };
    }
  
    // Parse the JSON response as a User object
    const user: Product = await response.json();
    return { result: true, message: "Product fetched", data: user };
  };

  export const AddProduct = async (product: Product, IsLocalCdn: boolean): Promise<ApiResponse> => {
    try {
        const response = await fetch(`/api/product/AddProduct?IsLocalCdn=${IsLocalCdn}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(product),
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Error:', errorData);
            return { result: false, message: errorData.message || 'Failed to create product', data: null };
        }

        const createdProduct: Product = await response.json();
        return { result: true, message: 'Product created successfully', data: createdProduct };

    } catch (error) {
        console.error('Request failed:', error);
        return { result: false, message: 'Failed to create product', data: null };
    }
};

export const DeleteProduct = async (productid: number): Promise<ApiResponse> => {
    try {
        const response = await fetch(`/api/product/DeleteProduct?id=${productid}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Error:', errorData);
            return { result: false, message: errorData.message || 'Failed to delete product', data: null };
        }

        return { result: true, message: 'Product deleted successfully', data: { productid } };

    } catch (error) {
        console.error('Request failed:', error);
        return { result: false, message: 'Failed to delete product', data: null };
    }
};

export const DeleteProducts = async (startid: number, endid: number): Promise<ApiResponse> => {
    try {
        const response = await fetch(`/api/product/DeleteProducts?startid=${startid}&endid=${endid}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Error:', errorData);
            return { result: false, message: errorData.message || 'Failed to delete product', data: null };
        }

        return { result: true, message: 'Products deleted successfully', data: `${startid}-${endid}` };

    } catch (error) {
        console.error('Request failed:', error);
        return { result: false, message: 'Failed to delete product', data: null };
    }
};

export const UpdateProduct = async (product: Product): Promise<ApiResponse> => {
    try {
        const response = await fetch(`/api/product/UpdateProduct?id=${product.productid}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(product),
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Error:', errorData);
            return { result: false, message: errorData.message || 'Failed to update product', data: null };
        }

        const updatedProduct: Product = await response.json();
        return { result: true, message: 'Product updated successfully', data: updatedProduct };

    } catch (error) {
        console.error('Request failed:', error);
        return { result: false, message: 'Failed to update product', data: null };
    }
};

