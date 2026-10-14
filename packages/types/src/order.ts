// Trang thai don hang
export type OrderStatus = "PENDING" | "CONFIRMED" | "SHIPPING" | "DELIVERED" | "CANCELLED";  

// Phuong thuc thanh toan
export type PaymentMethod = "MOMO" | "VIETCOMBANK" | "MB_BANK" | "COD";

// San pham trong gio hang
export interface CartItem {
  idProduct: number;
  idVariant: number;
  productName: string;
  thumbnail: string;
  variantSku: string;
  variantLabel?: string; 
  price: number;
  quantity: number;
}



// Don hang tong
export interface Order {
  idOrder: number;
  orderCode: string;          
  recipientName: string;      
  recipientPhone: string;   
  shippingAddress: string;    
  totalAmount: number;        
  paymentMethod: PaymentMethod;
  status: OrderStatus;
  items: OrderItem[];       
  createdAt: string;          
}

// Chi tiet san pham trong don da mua
export interface OrderItem {
  idOrderItem: number;
  idVariant: number;
  productName: string;
  variantSku: string;
  price: number;
  quantity: number;
  totalPrice: number;    // price * quantity
}