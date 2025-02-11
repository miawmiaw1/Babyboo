import React from 'react';
import { useNotifications } from './NotificationContext';

export const NotificationBasket = () => {
  const { Basket } = useNotifications();

  return (
    <div className="pe-2 d-flex align-items-center">
      <a 
        href="kurv" 
        className="p-0 nav-link position-relative" 
        id="dropdownMenuButton" 
        aria-expanded="false"
      >
        <i 
          className="mdi mdi-cart-outline" 
          style={{ 
            fontSize: '24px', 
            color: 'currentColor', 
            transition: 'color 0.3s ease' 
          }} 
          onMouseEnter={(e) => e.currentTarget.style.color = 'orange'} 
          onMouseLeave={(e) => e.currentTarget.style.color = 'currentColor'}
        ></i>
        <span 
          className="position-absolute top-0 start-100 translate-middle badge rounded-pill" 
          style={{ 
            backgroundColor: 'orange', 
            color: 'white', 
            fontWeight: 'bold', 
            fontSize: '10px', 
            padding: '1px 5px' 
          }}
        >
          {Basket.length}
        </span>
      </a>
    </div>
  );
};