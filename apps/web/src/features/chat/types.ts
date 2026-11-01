export interface ProductRecommendation {
  idProduct: number;
  name: string;
  brandName: string;
  price: number;
  thumbnail: string;
  inStock?: boolean;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: Date;
  suggestedProducts?: ProductRecommendation[];
  isLoading?: boolean;
}

export interface QuickPrompt {
  id: string;
  label: string;
  prompt: string;
}
