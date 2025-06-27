import * as yup from 'yup'

export const brandSchema = yup.object({
    brand_name: yup.string().trim().required('Brand Name is required'),
    brand_description: yup.string().trim().required('Brand Description is required'),
});
