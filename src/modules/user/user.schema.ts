import * as yup from "yup";

export const regSchema = yup.object({
  email: yup
    .string()
    .email("Email must be valid")
    .required("Email is required"),
  password: yup
    .string()
    .min(6, "Password must contain at least 6 characters")
    .max(100, "Password must contain less then 100 characters")
    .required("Password is required"),
});

export const loginSchema = yup.object({
  email: yup
    .string()
    .email("Email must be valid")
    .required("Email is required"),
  password: yup
    .string()
    .min(6, "Username must contain at least 6 characters")
    .max(100, "Password must contain less then 100 characters")
    .required("Password is required"),
});
