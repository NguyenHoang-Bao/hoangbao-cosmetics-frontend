import type { QuickPrompt, ProductRecommendation } from './types';

export const N8N_CHAT_WEBHOOK_URL = import.meta.env.VITE_N8N_CHAT_WEBHOOK_URL || '';

export const INITIAL_ASSISTANT_MESSAGE = 
  'Xin chào bạn! Tôi là chuyên viên AI tại **Hoàng Bảo Cosmetics**.\n\n' +
  'Tôi sẵn sàng hỗ trợ bạn tư vấn tình trạng da (mụn, nhạy cảm, phục hồi), xây dựng chu trình chăm sóc chuẩn y khoa và **gợi ý các sản phẩm chính hãng sẵn có tại cửa hàng** phù hợp nhất.';

export const DEFAULT_QUICK_PROMPTS: QuickPrompt[] = [
  {
    id: 'b5-restore',
    label: '💧 Tìm kem dưỡng phục hồi sau treatment dịu nhẹ',
    prompt: 'Da mình đang bị ửng đỏ sau treatment, shop có kem dưỡng phục hồi nào lành tính dịu nhẹ không?'
  },
  {
    id: 'acne-oily',
    label: '🧴 Da dầu mụn nên dùng toner/serum nào của shop?',
    prompt: 'Da mình nhiều dầu vùng chữ T và dễ nổi mụn, shop tư vấn serum hoặc toner kiềm dầu với.'
  },
  {
    id: 'sunscreen',
    label: '☀️ Kem chống nắng mỏng nhẹ cho da nhạy cảm',
    prompt: 'Gợi ý cho mình kem chống nắng mỏng nhẹ, không vón cục và an toàn cho da nhạy cảm.'
  },
  {
    id: 'routine-basic',
    label: '🌿 Routine sáng - tối tối giản chuẩn khoa học',
    prompt: 'Tư vấn giúp mình các bước skincare cơ bản sáng và tối với sản phẩm của shop.'
  }
];

export const MOCK_SHOP_PRODUCTS: Record<string, ProductRecommendation[]> = {
  restore: [
    {
      idProduct: 1,
      name: 'Kem Dưỡng Phục Hồi Cicaplast Baume B5+ 40ml',
      brandName: 'La Roche-Posay',
      price: 385000,
      thumbnail: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=200&auto=format&fit=crop&q=80',
      inStock: true
    }
  ],
  acne: [
    {
      idProduct: 2,
      name: 'Serum Kiểm Soát Dầu Niacinamide 10% + TXA 4%',
      brandName: 'Anua',
      price: 420000,
      thumbnail: 'https://images.unsplash.com/photo-1608248597359-5484831f50c6?w=200&auto=format&fit=crop&q=80',
      inStock: true
    }
  ],
  sunscreen: [
    {
      idProduct: 3,
      name: 'Kem Chống Nắng Rau Má Madagascar Centella SPF50+',
      brandName: 'Skin1004',
      price: 345000,
      thumbnail: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=200&auto=format&fit=crop&q=80',
      inStock: true
    }
  ]
};
