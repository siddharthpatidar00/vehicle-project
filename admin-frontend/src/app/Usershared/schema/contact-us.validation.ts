import * as yup from 'yup';

export const ContactUsSchema = yup.object().shape({
    firstName: yup.string().required('First name is required.'),
    lastName: yup.string().required('Last Name is required.'),
    mobile: yup.string().required('Mobile number is required.'),
    email: yup.string().required('Email is required.'),
    message: yup.string().required('Message is required.'),
});
