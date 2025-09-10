import * as yup from 'yup';

export const vehicleCategorySchema = yup.object({
    category_name: yup
        .string()
        .trim()
        .required('Category name is required.'),

    category_description: yup
        .string()
        .trim()
        .required('Category description is required.'),
});
