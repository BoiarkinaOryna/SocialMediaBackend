import * as yup from "yup"

export const postSchema = yup.object({
    title: yup
        .string()
        .required("Title is required"),
    topic: yup.string(),
    content: yup
        .string()
        .required("Content is required"),
    links: yup.array().of(yup.string())
})