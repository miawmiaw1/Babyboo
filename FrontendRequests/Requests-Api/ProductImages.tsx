export interface ProductImage {
  imageid: number;
  productid: number;
  image_url: string;
  description?: string;
  created_at: string;
}

interface ApiResponse {
    result: boolean,
    message?: string;
    data?: any;
}

// for api routes
export async function GetAllProductImages(productid: number): Promise<ApiResponse> {
  try {
      const response = await fetch(`http://localhost:5000/api/product-images/${productid}`, {
          method: 'GET',
          headers: {
              'Content-Type': 'application/json'
          },
      });

      if (!response.ok) {
          const errorData = await response.json();
          console.error('Error:', errorData.error);
          return { result: false, message: errorData.error, data: [] };
      }

      const images: ProductImage[] = await response.json();
      return { result: true, message: 'Images fetched successfully', data: images };
  } catch (error) {
      console.error('Request failed:', error);
      return { result: false, message: error instanceof Error ? error.message : 'An error occurred', data: null };
  }
}

// Add a new ProductImage entry
export async function AddProductImages(productImage: { productid: number; image_url: string; description?: string; }): Promise<ApiResponse> {
  try {
      const response = await fetch(`/api/productImages/CreateProductImage`, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify(productImage)
      });

      if (!response.ok) {
          const errorData = await response.json();
          console.error('Error:', errorData.error);
          return { result: false, message: errorData.error };
      }

      const newImage: ProductImage = await response.json();
      return { result: true, message: 'Image added successfully', data: newImage };
  } catch (error) {
      console.error('Request failed:', error);
      return { result: false, message: error instanceof Error ? error.message : 'An error occurred' };
  }
}

// Update a specific ProductImage entry
export async function UpdateProductImage(imageid: number, updates: { image_url?: string; description?: string; }): Promise<ApiResponse> {
  try {
      const response = await fetch(`/api/productImages/UpdateProductImage?id=${imageid}`, {
          method: 'PUT',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify(updates)
      });

      if (!response.ok) {
          const errorData = await response.json();
          console.error('Error:', errorData.error);
          return { result: false, message: errorData.error };
      }

      const updatedImage: ProductImage = await response.json();
      return { result: true, message: 'Image updated successfully', data: updatedImage };
  } catch (error) {
      console.error('Request failed:', error);
      return { result: false, message: error instanceof Error ? error.message : 'An error occurred' };
  }
}

// Delete a specific ProductImage entry
export async function DeleteProductImages(imageid: number): Promise<ApiResponse> {
  try {
      const response = await fetch(`/api/productImages/DeleteProductImage?id=${imageid}`, {
          method: 'DELETE',
          headers: {
              'Content-Type': 'application/json'
          },
      });

      if (!response.ok) {
          const errorData = await response.json();
          console.error('Error:', errorData.error);
          return { result: false, message: errorData.error };
      }

      const deletedImage: ProductImage = await response.json();
      return { result: true, message: 'Image deleted successfully', data: deletedImage };
  } catch (error) {
      console.error('Request failed:', error);
      return { result: false, message: error instanceof Error ? error.message : 'An error occurred' };
  }
}