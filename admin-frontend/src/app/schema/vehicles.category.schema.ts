import * as yup from 'yup';

export const vehicleCategorySchema = yup.object({
    category_name: yup
        .string()
        .trim()
        .required('category name is required'),

    category_description: yup
        .string()
        .trim()
        .required('category description is required'),
});
