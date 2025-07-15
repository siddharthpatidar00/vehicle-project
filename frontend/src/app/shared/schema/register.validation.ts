import * as yup from 'yup';

export const RegisterSchema = yup.object().shape({
    first_name: yup.string().required('First name is required'),
    last_name: yup.string().required('Last name is required'),
    gender: yup.string().required('Gender is required'),
    email: yup.string().email('Invalid email').required('Email is required'),
    password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
    mobile: yup.string().matches(/^\d{10}$/, 'Mobile must be 10 digits').required('Mobile is required'),
    company: yup.string().optional(),
    gst: yup.string().optional(),
    pan: yup.string().optional(),
    dob: yup.date().optional(),
    aadhar: yup.string().optional(),
    city: yup.string().optional(),
    address: yup.string().optional(),
    captcha: yup.string().required('Captcha is required'),
    sessionCaptcha: yup.string().optional(),
    status: yup.string().optional()
});
