export interface FeedbackRequest {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

export interface FeedbackResponse {
  idFeedback: number;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}
