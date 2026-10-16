import * as yup from 'yup';

// Regex check so dien thoai Viet Nam: 10 so, bat dau bang 0 hoac +84
const phoneRegex = /^(0|\+84)[0-9]{9}$/;

// Schema validate form Dang Nhap
export const loginSchema = yup.object({
  username: yup
    .string()
    .required('Vui lòng nhập số điện thoại hoặc email'),
  password: yup
    .string()
    .required('Vui lòng nhập mật khẩu')
    .min(6, 'Mật khẩu phải có ít nhất 6 ký tự'),
});

export type LoginFormData = yup.InferType<typeof loginSchema>;

// Schema validate form Dang Ky (khop voi RegisterRequest cua Spring Boot)
export const registerSchema = yup.object({
  fullName: yup
    .string()
    .required('Vui lòng nhập họ và tên của bạn'),
  username: yup
    .string()
    .required('Vui lòng nhập tên tài khoản')
    .min(4, 'Tên tài khoản phải từ 4 đến 50 ký tự'),
  email: yup
    .string()
    .required('Vui lòng nhập email')
    .email('Định dạng email không hợp lệ'),
  phoneNumber: yup
    .string()
    .required('Vui lòng nhập số điện thoại')
    .matches(phoneRegex, 'Số điện thoại không đúng định dạng'),
  password: yup
    .string()
    .required('Vui lòng nhập mật khẩu')
    .min(6, 'Mật khẩu phải có ít nhất 6 ký tự'),
  confirmPassword: yup
    .string()
    .required('Vui lòng xác nhận lại mật khẩu')
    .oneOf([yup.ref('password')], 'Mật khẩu xác nhận không trùng khớp'),
});

export type RegisterFormData = yup.InferType<typeof registerSchema>;
