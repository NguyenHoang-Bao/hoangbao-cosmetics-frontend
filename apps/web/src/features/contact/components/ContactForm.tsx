import { useState, type ChangeEvent, type FormEvent } from "react";
import { CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import * as yup from "yup";
import { contactApi } from "../api/contactApi";
import { contactFormSchema, type ContactFormData } from "../schemas/contactSchema";

export default function ContactForm() {
  const [formData, setFormData] = useState<ContactFormData>({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev: ContactFormData) => ({ ...prev, [name]: value }));
    // Xoa loi cua truong khi nguoi dung go tiep
    if (errors[name]) {
      setErrors((prev: Record<string, string>) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
    if (errorMessage) {
      setErrorMessage(null);
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validate form qua Yup
    try {
      await contactFormSchema.validate(formData, { abortEarly: false });
      setErrors({});
    } catch (err: unknown) {
      if (err instanceof yup.ValidationError) {
        const fieldErrors: Record<string, string> = {};
        for (const item of err.inner) {
          if (item.path && !fieldErrors[item.path]) {
            fieldErrors[item.path] = item.message;
          }
        }
        setErrors(fieldErrors);
      }
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      await contactApi.sendFeedback({
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        subject: formData.subject.trim(),
        message: formData.message.trim(),
      });
      setIsSuccess(true);
    } catch (err: unknown) {
      console.error("Loi gui feedback:", err);
      const msg =
        err instanceof Error
          ? err.message
          : "Có lỗi xảy ra khi gửi tin nhắn. Vui lòng thử lại sau ít phút!";
      setErrorMessage(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setIsSuccess(false);
    setFormData({
      name: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
    });
    setErrors({});
    setErrorMessage(null);
  };

  return (
    <div className="w-full lg:w-7/12">
      <div className="p-6 md:p-8 rounded-2xl border border-gray-200 bg-white shadow-xs">
        <h3 className="text-2xl font-bold mb-8 text-gray-900 uppercase tracking-wide">
          Gửi tin nhắn cho chúng tôi
        </h3>

        {isSuccess ? (
          <div className="py-12 px-6 text-center rounded-xl bg-rose-50/60 border border-rose-200">
            <div className="w-14 h-14 bg-rose-500 text-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <h4 className="text-xl font-bold text-gray-900 mb-2">
              Đã gửi tin nhắn thành công!
            </h4>
            <p className="text-gray-600 text-sm max-w-md mx-auto mb-6 leading-relaxed">
              Cảm ơn bạn{" "}
              <span className="font-semibold text-gray-900">{formData.name}</span>{" "}
              đã liên hệ. Đội ngũ tư vấn của Hoàng Bảo Cosmetics sẽ liên hệ lại với
              bạn trong thời gian sớm nhất!
            </p>
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center justify-center px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-rose-600 bg-white border border-rose-300 rounded-lg hover:bg-rose-50 transition-colors shadow-xs"
            >
              Gửi thêm tin nhắn khác
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} noValidate>
            {errorMessage && (
              <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-200 flex items-start gap-3 text-red-700 text-sm">
                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                <p>{errorMessage}</p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Ho va ten */}
              <div className="md:col-span-1">
                <label
                  htmlFor="contact-name"
                  className="block text-xs font-semibold text-gray-700 uppercase mb-1.5"
                >
                  Họ và Tên <span className="text-rose-500">*</span>
                </label>
                <input
                  id="contact-name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Họ và Tên của bạn"
                  className={`w-full px-4 py-3 border rounded-lg bg-white text-sm transition-colors outline-hidden focus:ring-1 focus:ring-rose-500 focus:border-rose-500 ${
                    errors.name ? "border-red-400 bg-red-50/20" : "border-gray-300"
                  }`}
                />
                {errors.name && (
                  <p className="mt-1 text-xs text-red-500">{errors.name}</p>
                )}
              </div>

              {/* Email */}
              <div className="md:col-span-1">
                <label
                  htmlFor="contact-email"
                  className="block text-xs font-semibold text-gray-700 uppercase mb-1.5"
                >
                  Email của bạn <span className="text-rose-500">*</span>
                </label>
                <input
                  id="contact-email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Email của bạn"
                  className={`w-full px-4 py-3 border rounded-lg bg-white text-sm transition-colors outline-hidden focus:ring-1 focus:ring-rose-500 focus:border-rose-500 ${
                    errors.email ? "border-red-400 bg-red-50/20" : "border-gray-300"
                  }`}
                />
                {errors.email && (
                  <p className="mt-1 text-xs text-red-500">{errors.email}</p>
                )}
              </div>

              {/* So dien thoai */}
              <div className="md:col-span-1">
                <label
                  htmlFor="contact-phone"
                  className="block text-xs font-semibold text-gray-700 uppercase mb-1.5"
                >
                  Số điện thoại <span className="text-rose-500">*</span>
                </label>
                <input
                  id="contact-phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Số điện thoại (10 chữ số)"
                  className={`w-full px-4 py-3 border rounded-lg bg-white text-sm transition-colors outline-hidden focus:ring-1 focus:ring-rose-500 focus:border-rose-500 ${
                    errors.phone ? "border-red-400 bg-red-50/20" : "border-gray-300"
                  }`}
                />
                {errors.phone && (
                  <p className="mt-1 text-xs text-red-500">{errors.phone}</p>
                )}
              </div>

              {/* Tieu de */}
              <div className="md:col-span-1">
                <label
                  htmlFor="contact-subject"
                  className="block text-xs font-semibold text-gray-700 uppercase mb-1.5"
                >
                  Tiêu đề <span className="text-rose-500">*</span>
                </label>
                <input
                  id="contact-subject"
                  name="subject"
                  type="text"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="Tiêu đề (VD: Tư vấn da, đơn hàng...)"
                  className={`w-full px-4 py-3 border rounded-lg bg-white text-sm transition-colors outline-hidden focus:ring-1 focus:ring-rose-500 focus:border-rose-500 ${
                    errors.subject ? "border-red-400 bg-red-50/20" : "border-gray-300"
                  }`}
                />
                {errors.subject && (
                  <p className="mt-1 text-xs text-red-500">{errors.subject}</p>
                )}
              </div>

              {/* Noi dung loi nhan */}
              <div className="col-span-1 md:col-span-2">
                <label
                  htmlFor="contact-message"
                  className="block text-xs font-semibold text-gray-700 uppercase mb-1.5"
                >
                  Nội dung lời nhắn <span className="text-rose-500">*</span>
                </label>
                <textarea
                  id="contact-message"
                  name="message"
                  rows={5}
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Nội dung lời nhắn hoặc tình trạng làn da bạn cần tư vấn..."
                  className={`w-full px-4 py-3 border rounded-lg bg-white text-sm transition-colors outline-hidden resize-none focus:ring-1 focus:ring-rose-500 focus:border-rose-500 ${
                    errors.message ? "border-red-400 bg-red-50/20" : "border-gray-300"
                  }`}
                />
                {errors.message && (
                  <p className="mt-1 text-xs text-red-500">{errors.message}</p>
                )}
              </div>

              {/* Nut gui */}
              <div className="col-span-1 md:col-span-2 mt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-rose-500 hover:bg-rose-600 disabled:bg-rose-300 text-white py-3.5 font-bold uppercase tracking-wider rounded-lg transition-colors shadow-md shadow-rose-200 cursor-pointer disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Đang gửi tin nhắn...</span>
                    </>
                  ) : (
                    <span>Gửi Tin Nhắn</span>
                  )}
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export { ContactForm };
