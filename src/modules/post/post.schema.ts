import * as yup from "yup"

export const postSchema = yup.object({
    title: yup
        .string(),
        // .required("Title is required"),
    topic: yup.string(),
    text: yup.string(),
<<<<<<< HEAD
    links: yup.array().of(yup.string())
=======
    url: yup.string()
>>>>>>> 0ab5b5f1cd12eea2354b5ab12d3483da1ec2a21b
})