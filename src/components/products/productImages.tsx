import React, { useState } from 'react';
import { type ProductImage } from '../../../FrontendRequests/Requests-Api/Product';

interface Props {
  images: ProductImage[];
}

export default function ProductImages({ images }: Props) {
  // State to keep track of the currently selected image
  const [selectedImage, setSelectedImage] = useState(images[0]?.image_url);

  return (
    <div className="col-12 col-lg-6">
      {/* Large image placeholder */}
      <img
        className="w-90 rounded-2"
        src={selectedImage}
        alt={selectedImage || 'Selected product'}
      />

      {/* Thumbnails */}
      <div className="d-flex mt-4">
        {images.slice(0, 4).map((image, index) => (
          <img
            key={index}
            className={`w-20 me-4 rounded-2 ${selectedImage === image.image_url ? 'border border-primary' : ''}`}
            src={image.image_url}
            alt={image.image_url || `Product thumbnail ${index + 1}`}
            onClick={() => setSelectedImage(image.image_url)}
            style={{ cursor: 'pointer' }}
          />
        ))}
      </div>
    </div>
  );
}
