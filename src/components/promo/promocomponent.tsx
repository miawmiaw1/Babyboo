import React, { useState } from 'react';
import { Modal } from 'react-bootstrap';
import Editpromo from "./EditPromo"
import { Folders, Identifier } from '../../../FrontendRequests/Enums/Images';

const PromoEdit = () => {
    const [showPromoEdit, setShowPromoEdit] = useState<boolean>(false);
      const [selectedimagetype, setselectedimagetype] = useState<string>();

        function handleedit(identifier: string) {
          setselectedimagetype(identifier)
          setShowPromoEdit(true);
        }

      const handleCloseEdit = () => setShowPromoEdit(false);
  return (
    <div>
      {/* Information banner */}
      <div className="mb-4 p-4 bg-white rounded shadow-lg">
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <h3>Information banner 🖼️</h3>
            <p>
              klik på en information banner for at ændre billedet
            </p>
          </div>
        </div>
      </div>

      {/* Image Banners */}
      <div className="row">
          <div className="col-md-6 mb-4 border border-dark">
            <strong>Banner 1</strong>
            <a style={{ textDecoration: 'none' }}>
              <div
                className="banner-image"
                style={{
                  backgroundImage: `url(https://res.cloudinary.com/${import.meta.env.CLOUDINARY_CLOUD_NAME}/image/upload/v${new Date().getTime()}/${Folders.MEDIA}/${Identifier.BANNER1}.jpg)`,
                  height: '300px',
                  borderRadius: '1rem',
                  cursor: 'pointer',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}
                onClick={() => handleedit(Identifier.BANNER1)}
              ></div>
            </a>
         </div>

        <div className="col-md-6 mb-4 border border-dark">
        <strong>Banner 2</strong>
          <a style={{ textDecoration: 'none' }}>
            <div
              className="banner-image"
              style={{
                backgroundImage: `url(https://res.cloudinary.com/${import.meta.env.CLOUDINARY_CLOUD_NAME}/image/upload/v${new Date().getTime()}/${Folders.MEDIA}/${Identifier.BANNER2}.jpg)`,
                height: '300px',
                borderRadius: '1rem',
                cursor: 'pointer',
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
              onClick={() => handleedit(Identifier.BANNER2)}
            ></div>
          </a>
        </div>

        <div id="navicon">
          {/* Navigation bar logo */}
          <div className="mb-4 p-4 bg-white rounded shadow-lg">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h3>Navigation bar 🖼️</h3>
                <p>
                  klik på Navigation bar logo for at ændre
                </p>
              </div>
            </div>
          </div>

          <div>
          <strong>Navigation bar</strong>
          <div className="mb-4 p-4 bg-gray rounded shadow-lg border border-dark">
            <a style={{ textDecoration: 'none', justifyContent: "center", alignItems: 'center', display: "flex" }}>
                <div
                  className="navbar-image"
                  style={{
                    backgroundImage: `url(https://res.cloudinary.com/${import.meta.env.CLOUDINARY_CLOUD_NAME}/image/upload/v${new Date().getTime()}/${Folders.MEDIA}/${Identifier.NAVBAR}.jpg)`,
                    borderRadius: '1rem',
                    cursor: 'pointer',
                    backgroundSize: 'contain', // Adjust the image size to fit while maintaining aspect ratio
                    backgroundPosition: 'center',
                    width: '30%', // Set the container width to 50%
                    paddingBottom: '30%', // Adjust the height to match the image's aspect ratio
                    position: 'relative' // Ensure aspect ratio is preserved
                  }}
                  onClick={() => handleedit(Identifier.NAVBAR)}
                ></div>
              </a>
          </div>
          </div>
        </div>

        <div id="Favicon">
          {/* Navigation bar logo */}
          <div className="mb-4 p-4 bg-white rounded shadow-lg">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h3>FavIcon 🖼️</h3>
                <p>
                  klik på FavIcon for at ændre (svg) format
                </p>
              </div>
            </div>
          </div>
          
          <div>
            <strong>FavIcon</strong>
            <div className="mb-4 p-4 bg-gray rounded shadow-lg border border-dark">
              <a style={{ textDecoration: 'none', justifyContent: "center", alignItems: 'center', display: "flex" }}>
                <div
                  className="favicon-image"
                  style={{
                    backgroundImage: `url(https://res.cloudinary.com/${import.meta.env.CLOUDINARY_CLOUD_NAME}/image/upload/v${new Date().getTime()}/${Folders.MEDIA}/${Identifier.FAVICON}.svg)`,
                    borderRadius: '1rem',
                    cursor: 'pointer',
                    backgroundSize: 'contain', // Adjust the image size to fit while maintaining aspect ratio
                    backgroundPosition: 'center',
                    width: '30%', // Set the container width to 50%
                    paddingBottom: '30%', // Adjust the height to match the image's aspect ratio
                    position: 'relative', // Ensure aspect ratio is preserved
                    display: 'flex',
                  }}
                  onClick={() => handleedit(Identifier.FAVICON)}
                ></div>
              </a>
            </div>
          </div>
        </div>

        <div id="DeliveryIcon">
          {/* Navigation bar logo */}
          <div className="mb-4 p-4 bg-white rounded shadow-lg">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h3>Delivery 🖼️</h3>
                <p>
                  klik på Delivery ikonet for at ændre
                </p>
              </div>
            </div>
          </div>
          
          <div>
            <strong>Delivery Icon</strong>
            <div className="mb-4 p-4 bg-gray rounded shadow-lg border border-dark">
              <a style={{ textDecoration: 'none', justifyContent: "center", alignItems: 'center', display: "flex" }}>
                <div
                  className="Deliveryicon-image"
                  style={{
                    backgroundImage: `url(https://res.cloudinary.com/${import.meta.env.CLOUDINARY_CLOUD_NAME}/image/upload/v${new Date().getTime()}/${Folders.MEDIA}/${Identifier.DELIVERY}.jpg)`,
                    borderRadius: '1rem',
                    cursor: 'pointer',
                    backgroundSize: 'contain', // Adjust the image size to fit while maintaining aspect ratio
                    backgroundPosition: 'center',
                    width: '30%', // Set the container width to 50%
                    paddingBottom: '30%', // Adjust the height to match the image's aspect ratio
                    position: 'relative', // Ensure aspect ratio is preserved
                    display: 'flex',
                  }}
                  onClick={() => handleedit(Identifier.DELIVERY)}
                ></div>
              </a>
            </div>
          </div>
        </div>
    </div>

      {/* Modal for EditPromoBanner */}
      <Modal show={showPromoEdit} onHide={handleCloseEdit} size="lg">
      <Modal.Header closeButton>
          <Modal.Title>Skift billede</Modal.Title>
      </Modal.Header>
      <Modal.Body>
      <Editpromo identifier={selectedimagetype as string} />
      </Modal.Body>
      </Modal>
    </div>
  );
};

export default PromoEdit;
