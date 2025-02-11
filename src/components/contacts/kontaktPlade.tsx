import React from "react";

interface Props {
    // order: string;
  }
  
  export default function KontaktPlade({
  }: Props) {
  
    return (
      <>
       <div className="container">
        <div className="row mt-5">
          <div className="col-12 col-md-4">
            <div className="card shadow-xs border">
              <div className="card-body p-3 d-flex">
                <div className="icon icon-shape bg-dark text-white text-center border-radius-sm d-flex align-items-center justify-content-center">
                <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m4 12 8-8 8 8M6 10.5V19a1 1 0 0 0 1 1h3v-3a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v3h3a1 1 0 0 0 1-1v-8.5"/>
                </svg>
                </div>
                <div className="ms-3">
                  <h5 className="mb-0">Adresse</h5>
                  <p className="mb-0 opacity-8">{import.meta.env.STOREADDRESS}</p>
                </div>
              </div>
            </div>
          </div>
          <div className="col-12 col-md-4 my-4 my-md-0">
            <div className="card shadow-xs border">
              <div className="card-body p-3 d-flex">
                <div className="icon icon-shape bg-dark text-white text-center border-radius-sm d-flex align-items-center justify-content-center">
                <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                    <path stroke="currentColor" stroke-linecap="round" stroke-width="2" d="M8 7V6a1 1 0 0 1 1-1h11a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1h-1M3 18v-7a1 1 0 0 1 1-1h11a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1Zm8-3.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z"/>
                </svg>
                </div>
                <div className="ms-3">
                  <h5 className="mb-0">Email</h5>
                  <p className="mb-0 opacity-8">{import.meta.env.STOREEMAIL}</p>
                </div>
              </div>
            </div>
          </div>
          <div className="col-12 col-md-4">
            <div className="card shadow-xs border">
              <div className="card-body p-3 d-flex">
                <div className="icon icon-shape bg-dark text-white text-center border-radius-sm d-flex align-items-center justify-content-center">
                <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.427 14.768 17.2 13.542a1.733 1.733 0 0 0-2.45 0l-.613.613a1.732 1.732 0 0 1-2.45 0l-1.838-1.84a1.735 1.735 0 0 1 0-2.452l.612-.613a1.735 1.735 0 0 0 0-2.452L9.237 5.572a1.6 1.6 0 0 0-2.45 0c-3.223 3.2-1.702 6.896 1.519 10.117 3.22 3.221 6.914 4.745 10.12 1.535a1.601 1.601 0 0 0 0-2.456Z"/>
                </svg>
                </div>
                <div className="ms-3">
                  <h5 className="mb-0">Telefon Nummer</h5>
                  <p className="mb-0 opacity-8">{import.meta.env.STOREPHONE}</p>
                </div>
              </div>
            </div>         
          </div>
        </div>
        </div>
      </>
    );
  };