import React, { type JSX } from "react";
import {type Product } from '../../../FrontendRequests/Requests-Api/Product';
interface Props {
  product: Product
}

export default function ProductAccordion({
  product
}: Props) {
  const accordion: JSX.Element[] = [];
  let i = 0;

  const data = {
    "specifikationer": product?.features.toString(),
    "Producent": product?.manufacturer,
    "Forsendelse": `
        Vi har 1 til 5 hverdages leveringstid på alle vores produkter al afhængig af lagerstatus. 
        `,
    "Returneringer": `
        Du skal sende din ordre retur til os uden unødig forsinkelse og senest 30 dage efter,
        du har meddelt os, at du ønsker at fortryde dit køb.
        Du skal afholde de direkte udgifter i forbindelse med tilbagelevering af varen.
        Ved returnering er du ansvarlig for, at varen er pakket forsvarligt ind.
        Du bærer risikoen for varen fra tidspunktet for varens levering.
        `,
    "tags": product?.tags.toString(),
  }

  Object.entries(data).map(([title,value],i) => {
    if (i != 0) {
      accordion.push(
        <div className="accordion-item">
          <h5 className="accordion-header" id={"heading" + i}>
            <button className="accordion-button border-bottom font-weight-bold py-4" type="button" data-bs-toggle="collapse" data-bs-target={"#collapse" + i} aria-expanded="false" aria-controls={"collapse" + i}>
              {title}
              <i className="collapse-close fa fa-plus text-xs pt-1 position-absolute end-0 me-3" aria-hidden="true"></i>
              <i className="collapse-open fa fa-minus text-xs pt-1 position-absolute end-0 me-3" aria-hidden="true"></i>
            </button>
          </h5>
          <div id={"collapse" + i} className="accordion-collapse collapse" aria-labelledby={"heading" + i} data-bs-parent="#accordionEcommerce">
            <div className="accordion-body text-body text-sm opacity-8">
              {value}
            </div>
          </div>
        </div>
      )
    } else {
      accordion.push(
        <div className="accordion-item">
          <h5 className="accordion-header" id={"heading" + i}>
            <button className="accordion-button border-bottom font-weight-bold collapsed py-4" type="button" data-bs-toggle="collapse" data-bs-target={"#collapse" + i} aria-expanded="true" aria-controls={"collapse" + i}>
              {title}
              <i className="collapse-close fa fa-plus text-xs pt-1 position-absolute end-0 me-3" aria-hidden="true"></i>
              <i className="collapse-open fa fa-minus text-xs pt-1 position-absolute end-0 me-3" aria-hidden="true"></i>
            </button>
          </h5>
          <div id={"collapse" + i} className="accordion-collapse collapse show" aria-labelledby={"heading" + i} data-bs-parent="#accordionEcommerce">
            <div className="accordion-body text-body text-sm opacity-8">
              {value}
            </div>
          </div>
        </div>
      )
    }
  })

  return (
    <>
      <div className="accordion mt-5" id="accordionEcommerce">
        {accordion}
      </div>
    </>
  );
}





