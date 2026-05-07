import * as yup from "yup"

export const postSchema = yup.object({
    title: yup
        .string(),
        // .required("Title is required"),
    topic: yup.string(),
    text: yup.string(),
    url: yup.string()
})