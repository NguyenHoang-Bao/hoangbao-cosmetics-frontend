import * as yup from "yup";

// Regex check so dien thoai Viet Nam chuan 10 chu so
const phoneRegex = /^(0|\+84)(3[2-9]|5[2689]|7[06-9]|8[1-9]|9[0-9])[0-9]{7}$/;

export const contactFormSchema = yup.object({
  name: yup
    .string()
    .trim()
    .required("Vui lòng nhập họ và tên của bạn")
    .min(2, "Họ và tên phải có ít nhất 2 ký tự")
    .max(100, "Họ và tên không được vượt quá 100 ký tự"),
  email: yup
    .string()
    .trim()
    .required("Vui lòng nhập email")
    .email("Định dạng email không hợp lệ (ví dụ: ten@gmail.com)"),
  phone: yup
    .string()
    .trim()
    .required("Vui lòng nhập số điện thoại")
    .matches(
      phoneRegex,
      "Số điện thoại không hợp lệ (gồm 10 số, bắt đầu bằng 03, 05, 07, 08, 09)"
    ),
  subject: yup
    .string()
    .trim()
    .required("Vui lòng nhập tiêu đề")
    .min(2, "Tiêu đề phải có ít nhất 2 ký tự")
    .max(200, "Tiêu đề không được vượt quá 200 ký tự"),
  message: yup
    .string()
    .trim()
    .required("Vui lòng nhập nội dung lời nhắn")
    .min(10, "Nội dung lời nhắn phải có ít nhất 10 ký tự")
    .max(2000, "Nội dung lời nhắn không được vượt quá 2000 ký tự"),
});

export type ContactFormData = yup.InferType<typeof contactFormSchema>;
