export interface Category {
    categoryid: number;
    categoryname: string;
    categoryimage: string
    categorydescription: string;
}

interface ApiResponse {
    result: boolean,
    message?: string;
    data?: any;
}

export async function FetchAllCateGories(): Promise<ApiResponse> {
    try {
        const response = await fetch(`/api/category/GetCategories`, {
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

        const countries: Category[] = await response.json();
        return { result: true, message: 'Categories fetched', data: countries};

    } catch (error) {
        console.error('Categories failed:', error);
        return { result: false, message: "", data: null };
    }
}

export async function AddCategorY(
    categoryname: string,
    categoryimage: string,
    categorydescription: string
): Promise<ApiResponse> {
    try {
        const response = await fetch(`/api/category/CreateCategory`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                categoryname,
                categoryimage,
                categorydescription,
            }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Error adding category:', errorData.error);
            return { result: false, message: errorData.error, data: null };
        }

        const newCategory: Category = await response.json();
        return { result: true, message: 'Category added successfully', data: newCategory };

    } catch (error) {
        console.error('Failed to add category:', error);
        return { result: false, message: "", data: null };
    }
}

export async function GetCategoryById(categoryid: string): Promise<ApiResponse> {
    try {
        const response = await fetch(`/api/category/GetCategoryById?id=${categoryid}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Error fetching category:', errorData.error);
            return { result: false, message: errorData.error, data: null };
        }

        const category: Category = await response.json();
        return { result: true, message: 'Category fetched successfully', data: category };

    } catch (error) {
        console.error('Failed to fetch category:', error);
        return { result: false, message: "", data: null };
    }
}

export async function UpdateCategory(
    categoryid: number,
    categoryname?: string,
    categoryimage?: string,
    categorydescription?: string
): Promise<ApiResponse> {
    try {
        // Send the PUT request with the update data
        const response = await fetch(`/api/category/UpdateCategory?id=${categoryid}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                categoryname,
                categoryimage,
                categorydescription,
            }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Error updating category:', errorData.error);
            return { result: false, message: errorData.error, data: null };
        }

        const updatedCategory: Category = await response.json();
        return { result: true, message: 'Category updated successfully', data: updatedCategory };

    } catch (error) {
        console.error('Failed to update category:', error);
        return { result: false, message: "", data: null };
    }
}

export async function DeleteCategoryById(categoryid: number): Promise<ApiResponse> {
    try {
        const response = await fetch(`/api/category/DeleteCategory?id=${categoryid}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Error deleting category:', errorData.error);
            return { result: false, message: 'Category not found', data: null };
        }

        // Category deleted successfully, no content to return
        const addedcategory: Category = await response.json();
        return { result: true, message: 'Category deleted successfully', data: addedcategory };
    } catch (error) {
        console.error('Failed to delete category:', error);
        return { result: false, message: "", data: null };
    }
}
