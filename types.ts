
export enum AccountType {
  USER = 'USER',
  BUSINESS = 'BUSINESS'
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl: string;
  sellerId: string;
  sellerName: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  type: AccountType;
  businessName?: string;
  businessCategory?: string;
}

export interface CartItem extends Product {
  quantity: number;
}
