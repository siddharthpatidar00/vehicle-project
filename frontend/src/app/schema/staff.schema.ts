import * as yup from 'yup';

export const staffSchema = yup.object({
    first_name: yup.string().required('First name is required.'),
    last_name: yup.string().required('Last name is required.'),
    email: yup.string().email('Must be a valid email.').required('Email is required.'),
    password: yup.string().min(6, 'Password must be at least 6 characters.').required('Password is required.'),
    user_type: yup.string().oneOf(['subadmin', 'manager', 'admin', 'ceo']).required('User type is required.'),
    status: yup.string().oneOf(['Active', 'Inactive']).required('Status is required.')
});
