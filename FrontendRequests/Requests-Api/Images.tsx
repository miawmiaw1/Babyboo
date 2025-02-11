interface ApiResponse {
    result: boolean,
    message?: string;
    data: string | null;
}

export const generateUniqueImageName = () => {
    const timestamp = Date.now();
    return `image_${timestamp}`;
  };

export function isValidLink(link: string): boolean {
const urlRegex = /^(https?:\/\/)?([a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)+.*)$/;
return urlRegex.test(link);
}

export async function AddCategoryImage(
    file: File,
    foldername: string,
    categoryname: string,
    filetype: string
): Promise<ApiResponse> {
    try {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('foldername', foldername);
        formData.append('categoryname', categoryname);
        formData.append('filetype', filetype);

        const response = await fetch(`/api/Images/category/POST`, {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Error adding category image:', errorData.error);
            return { result: false, message: errorData.error, data: null };
        }

        const newimage = await response.json();
        return { result: true, message: 'Category image added successfully', data: newimage };

    } catch (error) {
        console.error('Failed to add category image:', error);
        return { result: false, message: "", data: null };
    }
}

export async function DeleteCategoryImage(
    categoryname: string,
    foldername: string,
): Promise<ApiResponse> {
    try {
        const response = await fetch(`/api/Images/category/DELETE`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                categoryname,
                foldername
            }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Error deleting category image:', errorData.error);
            return { result: false, message: errorData.error, data: null };
        }

        const newimage = await response.json();
        return { result: true, message: 'category image deleted successfully', data: newimage };

    } catch (error) {
        console.error('Failed to delete category image:', error);
        return { result: false, message: "", data: null };
    }
}

export async function AddProductImage(
    file: File,
    categoryname: string,
    productid: string,
    imagename: string,
    filetype: string
): Promise<ApiResponse> {
    try {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('categoryname', categoryname);
        formData.append('productid', productid);
        formData.append('imagename', imagename);
        formData.append('filetype', filetype);


        const response = await fetch(`/api/Images/product/POST`, {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Error adding product image:', errorData.error);
            return { result: false, message: errorData.error, data: null };
        }

        const newimage = await response.json();
        return { result: true, message: 'product image added successfully', data: newimage };

    } catch (error) {
        console.error('Failed to add product image:', error);
        return { result: false, message: "", data: null };
    }
}

export async function DeleteProductImage(
    imageurl: string,
): Promise<ApiResponse> {
    try {
        const response = await fetch(`/api/Images/product/DELETE`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                imageurl
            }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Error deleting product image:', errorData.error);
            return { result: false, message: errorData.error, data: null };
        }

        const newimage = await response.json();
        return { result: true, message: 'product image deleted successfully', data: newimage };

    } catch (error) {
        console.error('Failed to delete product image:', error);
        return { result: false, message: "", data: null };
    }
}


export async function DeleteAllImages(
    foldername: string,
): Promise<ApiResponse> {
    try {
        const response = await fetch(`/api/Images/product/DELETEALL`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                foldername
            }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Error deleting product images:', errorData.error);
            return { result: false, message: errorData.error, data: null };
        }

        const deletimages = await response.json();
        return { result: true, message: 'product image deleted successfully', data: deletimages };

    } catch (error) {
        console.error('Failed to delete product image:', error);
        return { result: false, message: "", data: null };
    }
}

export async function AddMediaImage(
    file: File,
    foldername: string,
    medianame: string,
    filetype: string
): Promise<ApiResponse> {
    try {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('foldername', foldername);
        formData.append('medianame', medianame);
        formData.append('filetype', filetype);
        const response = await fetch(`/api/Images/Media/POST`, {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Error adding product image:', errorData.error);
            return { result: false, message: errorData.error, data: null };
        }

        const newimage = await response.json();
        return { result: true, message: 'product image added successfully', data: newimage };

    } catch (error) {
        console.error('Failed to add product image:', error);
        return { result: false, message: "", data: null };
    }
}

export async function DeleteMediaImage(
    medianame: string,
): Promise<ApiResponse> {
    try {
        const response = await fetch(`/api/Images/Media/DELETE`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                medianame
            }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Error deleting media image:', errorData.error);
            return { result: false, message: errorData.error, data: null };
        }

        const newimage = await response.json();
        return { result: true, message: 'media image deleted successfully', data: newimage };

    } catch (error) {
        console.error('Failed to delete media image:', error);
        return { result: false, message: "", data: null };
    }
}