export const shippingprice = {
  homedelivery: 50,
  parceldelivery: 40
  };

  export function getShippingPrice(productCount) {
    const priceTiers = [
        { count: 1, price: 59 },
        { count: 2, price: 79 },
        { count: 3, price: 89 },
        { count: 6, price: 99 },
        { count: 8, price: 119 },
        { count: 14, price: 139 },
        { count: 23, price: 159 }
    ];

    let shippingPrice = 159; // Default to the highest known price tier
    
    for (let i = 0; i < priceTiers.length; i++) {
        if (productCount <= priceTiers[i].count) {
            shippingPrice = priceTiers[i].price;
            break;
        }
    }
    
    return shippingPrice;
}
