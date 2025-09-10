// user.schema.ts
import * as yup from 'yup';

export const userSchema = yup.object().shape({
    first_name: yup.string().required('First name is required.'),
    last_name: yup.string().required('Last name is required.'),
    gender: yup.string().required('Gender is required.'),
    email: yup.string().email('Invalid email.').required('Email is required.'),
    password: yup
        .string()
        .min(6, 'Password must be at least 6 characters.')
        .required('Password is required.'),
});
