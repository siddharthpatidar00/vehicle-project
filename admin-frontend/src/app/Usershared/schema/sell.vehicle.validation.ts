import * as yup from 'yup';

export const SellVehicleSchema = yup.object().shape({
    name: yup.string().required('Name is required'),
    model: yup.string().required('Model is required'),
    brand: yup.string().required('Brand is required'),
    category: yup.string().required('Category is required'),
    manufacture_year: yup.string().required('Manufacture Year is required'),
    sell_or_rent: yup.string().required('Sell or Rent is required'),
    status: yup.string().required('Status is required'),
    description: yup.string().required('Description is required'),
    phone: yup.string()
        .required('Phone number is required')
        .matches(/^[0-9]{10}$/, 'Phone number must be 10 digits'),
    img: yup
        .mixed()
        .required('Vehicle image is required'),
    ownership: yup.string().required('Ownership is required')
});
