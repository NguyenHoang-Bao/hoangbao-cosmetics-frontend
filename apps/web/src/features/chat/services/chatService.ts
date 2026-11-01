import type { ChatMessage, ProductRecommendation } from '../types';
import { N8N_CHAT_WEBHOOK_URL, MOCK_SHOP_PRODUCTS } from '../config';

interface N8nResponsePayload {
  output?: string;
  response?: string;
  text?: string;
  products?: ProductRecommendation[];
}

export const getOrCreateSessionId = (): string => {
  const STORAGE_KEY = 'hb_chat_session_id';
  let sessionId = localStorage.getItem(STORAGE_KEY);
  if (!sessionId) {
    sessionId = 'session_' + Math.random().toString(36).substring(2, 11) + '_' + Date.now();
    localStorage.setItem(STORAGE_KEY, sessionId);
  }
  return sessionId;
};

export const sendMessageToAssistant = async (
  message: string,
  history: ChatMessage[]
): Promise<{ text: string; suggestedProducts?: ProductRecommendation[] }> => {
  const sessionId = getOrCreateSessionId();

  // 1. If N8N Webhook URL is configured, send HTTP POST request
  if (N8N_CHAT_WEBHOOK_URL) {
    try {
      const response = await fetch(N8N_CHAT_WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          sessionId,
          message,
          history: history.slice(-6).map((msg) => ({
            role: msg.sender,
            content: msg.text
          }))
        })
      });

      if (!response.ok) {
        throw new Error(`Webhook error status: ${response.status}`);
      }

      const data = (await response.json()) as N8nResponsePayload;
      const text = data.output || data.response || data.text || 'Tôi đã nhận được câu hỏi của bạn.';
      return {
        text,
        suggestedProducts: data.products
      };
    } catch (err) {
      console.warn('[n8n Webhook] Failed or unreachable, falling back to smart local response:', err);
    }
  }

  // 2. Intelligent local fallback response (Basic Luxury & Skincare + Shop Recommendations)
  await new Promise((resolve) => setTimeout(resolve, 700));

  const lower = message.toLowerCase();

  if (lower.includes('phục hồi') || lower.includes('b5') || lower.includes('ửng đỏ') || lower.includes('rát') || lower.includes('treatment')) {
    return {
      text: 'Làn da bạn đang có dấu hiệu **tổn thương hàng rào bảo vệ (Skin Barrier)**. Trong giai đoạn này, bạn nên tạm ngưng các acid mạnh (BHA/AHA) trong 3 - 5 ngày và tập trung cấp ẩm phục hồi với hoạt chất Vitamin B5 (Panthenol) hoặc Madecassoside.\n\nSản phẩm phục hồi được ưa chuộng nhất tại Hoàng Bảo Cosmetics:',
      suggestedProducts: MOCK_SHOP_PRODUCTS.restore
    };
  }

  if (lower.includes('dầu') || lower.includes('mụn') || lower.includes('kiềm dầu') || lower.includes('niacinamide') || lower.includes('lỗ chân lông')) {
    return {
      text: 'Với làn da thiên dầu dễ lên mụn, nguyên tắc quan trọng là **cân bằng tỷ lệ dầu - nước** và kiểm soát bã nhờn mà không làm khô căng da. Bạn nên ưu tiên Niacinamide kết hợp Tranexamic Acid để vừa kiềm dầu vừa ngăn ngừa thâm mụn.\n\nSản phẩm chuyên biệt cho da dầu mụn tại shop:',
      suggestedProducts: MOCK_SHOP_PRODUCTS.acne
    };
  }

  if (lower.includes('chống nắng') || lower.includes('kcn') || lower.includes('nhạy cảm') || lower.includes('nâng tone')) {
    return {
      text: 'Kem chống nắng là bước bảo vệ tối quan trọng trong mọi chu trình. Đối với da nhạy cảm hoặc đang phục hồi, bạn nên chọn kem chống nắng vật lý lai hóa học chứa chiết xuất làm dịu như Rau má (Centella), kết cấu mỏng nhẹ không gây bít tắc.\n\nDòng kem chống nắng bán chạy và lành tính tại shop:',
      suggestedProducts: MOCK_SHOP_PRODUCTS.sunscreen
    };
  }

  return {
    text: 'Cảm ơn bạn đã chia sẻ! Tôi đã ghi nhận tình trạng da của bạn. Để đưa ra phác đồ chăm sóc chuẩn xác và gợi ý sản phẩm phù hợp nhất tại cửa hàng Hoàng Bảo, bạn có thể cho tôi biết thêm về: **loại da hiện tại (dầu/khô/hỗn hợp)** và **mục tiêu chăm sóc da** chính của bạn nhé.',
    suggestedProducts: MOCK_SHOP_PRODUCTS.restore
  };
};
