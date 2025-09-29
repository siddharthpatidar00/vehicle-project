import * as yup from 'yup';

export const happyCustomerSchema = (isEdit: boolean = false) => yup.object({
    name: yup.string().required('Name is required.'),
    message: yup.string().required('Message is required.'),
    image: isEdit
        ? yup.mixed().nullable() // allow null for edit
        : yup.mixed().required('Image is required.')
});
