import { apiClient } from "@hoangbao/api-client";
import type { ApiResponse, FeedbackRequest, FeedbackResponse } from "@hoangbao/types";

export const contactApi = {
  // Goi API gui phan hoi / lien he toi backend Spring Boot
  sendFeedback: async (payload: FeedbackRequest): Promise<FeedbackResponse> => {
    const response = await apiClient.post<any, ApiResponse<FeedbackResponse>>("/feedbacks", payload);
    return response.data;
  },
};
