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
            backgroundImage: `url(https://res.cloudinary.com/${import.meta.env.CLOUDINARY_CLOUD_NAME}/image/upload/v${new Date().getTime()}/${Folders.MEDIA}/banner${bannernumber}.jpg)`,
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
