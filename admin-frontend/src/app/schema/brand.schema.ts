import * as yup from 'yup'

export const brandSchema = yup.object({
    brand_name: yup.string().trim().required('Brand name is required.'),
    brand_description: yup.string().trim().required('Brand description is required.'),
});
