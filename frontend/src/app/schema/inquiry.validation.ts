import * as yup from 'yup';

// Minimal validation as requested
export const VehicleInquirySchema = yup.object().shape({
    name: yup.string().required('Name is required'),
    phone_number: yup.string().required('Phone number is required'),
    buy_sell_rent: yup.string().required('Buy_Sell_Rent is required')
});
