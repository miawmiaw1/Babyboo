import React from 'react';
import { Folders } from '../../../FrontendRequests/Enums/Images';

interface Props {
  bannernumber: number;
}

export default function PromoSectionLarge({
  bannernumber,
}: Props) {
  return (
    <section>
      <a style={{ textDecoration: 'none' }}>
        <div
          className="promo-section"
          style={{
            backgroundImage:
            bannernumber === 1
              ? `url(https://res.cloudinary.com/dbrlhsgqv/image/upload/v1742836836/banner1_uy51qr.jpg)`
              : bannernumber === 2
              ? `url(https://res.cloudinary.com/dbrlhsgqv/image/upload/v1742836842/banner2_yqso8h.jpg)`
              : 'none', // Fallback
            backgroundSize: 'cover', // Ensure the image covers the div
            backgroundPosition: 'top',
            height: '360px', // Fixed height
            borderRadius: '1rem',
            cursor: 'pointer', // Indicate the container is clickable
          }}
        ></div>
      </a>
    </section>
  );
}
