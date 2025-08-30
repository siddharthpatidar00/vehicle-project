import * as yup from 'yup';

export const PersonalVehicleInquirySchema = yup.object().shape({
    name: yup.string().required('Name is required'),
    phone_number: yup.string().required('Phone number is required')
});
