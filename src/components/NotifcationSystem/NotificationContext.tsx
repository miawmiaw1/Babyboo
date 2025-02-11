import { useState } from 'react';
import type { Product, ProductColorSize } from '../../../FrontendRequests/Requests-Api/Product';

type Notification = {
  id: number;
  title: string;
  message: string;
  date: string;
};

type BasketProduct = {
    ProductId: number;
    ProductCustoms: ProductColorSize;
    quantity: number
  };

export interface ExtendedBasketProduct extends Product {
  quantity: number;
}

const LOCAL_STORAGE_KEY_Notifications = 'notifications';
const LOCAL_STORAGE_KEY_Basket = 'basket';

export const useNotifications = () => {
    const [Basket, setBasket] = useState<BasketProduct[]>(() => {
        // Load notifications from localStorage on initial render
        const storedProducts = localStorage.getItem(LOCAL_STORAGE_KEY_Basket);
        return storedProducts ? JSON.parse(storedProducts) : [];
      });
  const [notifications, setNotifications] = useState<Notification[]>(() => {
    // Load notifications from localStorage on initial render
    const storedNotifications = sessionStorage.getItem(LOCAL_STORAGE_KEY_Notifications);
    return storedNotifications ? JSON.parse(storedNotifications) : [];
  });
  const [nextId, setNextId] = useState(() => {
    // Load next ID from notifications or default to 0
    const storedNotifications = sessionStorage.getItem(LOCAL_STORAGE_KEY_Notifications);
    const storedArray = storedNotifications ? JSON.parse(storedNotifications) : [];
    return storedArray.length > 0 ? storedArray[storedArray.length - 1].id + 1 : 0;
  });

  const addToBasket = (ProductId: number, ProductCustoms: ProductColorSize) => {
    const quantity: number = 1;
    const newProduct = { ProductId, ProductCustoms, quantity};

    // Check if the product already exists in the basket
    const productExists = Basket.some(
      (item) =>
        item.ProductId === ProductId &&
        JSON.stringify(item.ProductCustoms) === JSON.stringify(ProductCustoms)
    );

    if (productExists) {
      // If the product exists, don't add it again
      alert("Produktet er allerede i kurven");
      return;
    }

    // Add the new product to the basket
    const UpdatedProducts = [...Basket, newProduct];
    setBasket(UpdatedProducts);
    localStorage.setItem(LOCAL_STORAGE_KEY_Basket, JSON.stringify(UpdatedProducts));
  };

  const UpdateBasketQuantity = (ProductId: number, ProductCustoms: ProductColorSize, NewQuantity: number) => {
      // Find the index of the product to be updated
      const storedProducts = localStorage.getItem(LOCAL_STORAGE_KEY_Basket);
      const basketproducts = (storedProducts ? JSON.parse(storedProducts) : []) as BasketProduct[];

      const productIndex = basketproducts.findIndex(
        (item) =>
          item.ProductId === ProductId &&
          JSON.stringify(item.ProductCustoms) === JSON.stringify(ProductCustoms)
      );

      if (productIndex === -1) {
        return;
      }

      // Create a new basket with the updated product
      const UpdatedProducts = [...basketproducts];
      UpdatedProducts[productIndex] = {
        ...UpdatedProducts[productIndex],
        quantity: NewQuantity,
      };
      localStorage.setItem(LOCAL_STORAGE_KEY_Basket, JSON.stringify(UpdatedProducts));
      setBasket(UpdatedProducts)
  }
  
  const removeFromBasket = (ProductIndex: number) => {
    const UpdatedProducts = Basket.filter((_, index) => index !== ProductIndex);
    setBasket(UpdatedProducts);
    localStorage.setItem(LOCAL_STORAGE_KEY_Basket, JSON.stringify(UpdatedProducts));
  };

  const RemoveAllBasket = () => {
    localStorage.removeItem(LOCAL_STORAGE_KEY_Basket);
  };

  const addNotification = (title: string, message: string, date: string) => {
    const newNotification = { id: nextId, title, message, date };
    const updatedNotifications = [...notifications, newNotification];
    setNotifications(updatedNotifications);
    setNextId((prev: number) => prev + 1);
    sessionStorage.setItem(LOCAL_STORAGE_KEY_Notifications, JSON.stringify(updatedNotifications));
  };

  const removeNotification = (id: number) => {
    const updatedNotifications = notifications.filter((note) => note.id !== id);
    setNotifications(updatedNotifications);
    sessionStorage.setItem(LOCAL_STORAGE_KEY_Notifications, JSON.stringify(updatedNotifications));
  };

  return { Basket, notifications, addToBasket, removeFromBasket, RemoveAllBasket, UpdateBasketQuantity, addNotification, removeNotification };
};