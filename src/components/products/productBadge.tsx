import React, {useEffect, useState } from 'react';
import { type ProductColorSize } from '../../../FrontendRequests/Requests-Api/Product';
interface Props {
  colorsize: ProductColorSize[];
  productid: number;
  addtocart: boolean
}

export default function ProductBadge({
  colorsize,
  productid,
  addtocart
}: Props) {
  const [GetColor, SetColor] = useState<ProductColorSize[] | null>(null);
  const colors = ["Orange", "Yellow", "Blue"]

  useEffect(() => {    
    if (colorsize !== undefined) {
      const uniqueColors = colorsize.filter((item, index, self) =>
        index === self.findIndex((t) => (
            t.colorname === item.colorname // Check for unique colorname
        ))
    )
    .slice(0, 3); // Get the first three unique colors
    
    SetColor(uniqueColors)
    }
  }, [colorsize]); // Re-run when colorsize changes
  return (
    <>
  {GetColor ? (
    GetColor.map(color => badge(color.colorname as string, color, productid, addtocart))
  ) : (
    colors.map(color => badge(color, {} as ProductColorSize, productid, addtocart))
  )}
    </>
  );
}

function badge(color:string, identifier:ProductColorSize, productid:number, addtocart: boolean) {
  if (addtocart) {
    const badgeClass = "badge filter rounded-4 bg-" + color.toLocaleLowerCase();
    const badge = <a className={badgeClass} style={{ pointerEvents: 'none' }}></a>
    
    return badge;
  } else {
      const badgeClass = "badge filter rounded-4 bg-" + color.toLocaleLowerCase();
      const badge = <a href={`/ProductDetails?id=${productid}&Identifier=${JSON.stringify(identifier)}`} className={badgeClass}></a>
      
      return badge;
    }
}

