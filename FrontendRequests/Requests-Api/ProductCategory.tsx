interface ProductCategory {
    productId: number;
    categoryId: number;
  }

interface ApiResponse {
    result: boolean,
    message?: string;
    data?: any;
}

export async function GetProductCategories(): Promise<ApiResponse> {
    try {
        const response = await fetch(`/api/productCategory/GetProductCategories`, {
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

        const countries: ProductCategory[] = await response.json();
        return { result: true, message: 'ProductCategory fetched', data: countries};

    } catch (error) {
        console.error('Request failed:', error);
        return { result: false, message: "", data: null };
    }
}

export async function GetProductCategoriesByCategoryId(categoryid: number): Promise<ApiResponse> {
    try {
        const response = await fetch(`/api/productCategory/GetProductCategoriesByCategoryId?id=${categoryid}`, {
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

        const countries: ProductCategory[] = await response.json();
        return { result: true, message: 'ProductCategory fetched', data: countries};

    } catch (error) {
        console.error('Request failed:', error);
        return { result: false, message: "", data: null };
    }
}



