import * as yup from 'yup';

export const vehicleSchema = yup.object({
    name: yup.string().required('Vehicle name is required.'),
    model: yup.string().nullable(),
    brand: yup.string().required('Brand is required.'),
    category:yup.string().required('Category is required.'),
    km_driven: yup.number().nullable(),
    ownership: yup.string().nullable(),
    manufacture_year: yup.number().nullable(),
    isInsured: yup
        .string()
        .required('Must select insured status.')
        .oneOf(['true', 'false'], 'Invalid insured option.'),
    insuranceValidTill: yup.date().nullable(),
    price: yup.number().nullable(),
    status: yup.string().nullable(),
    sell_or_rent: yup.string().required('Must select sell or rent.'),
    description: yup.string().nullable()
});
