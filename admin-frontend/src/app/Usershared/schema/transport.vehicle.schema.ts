//  src/app/shared/schema/transport.vehicle.schema.ts 

import * as yup from 'yup';

export const TransportVehicleSchema = yup.object().shape({
    name: yup.string().required('Name is required'),
    pickup_location: yup.string().required('Pickup location is required'),
    drop_location: yup.string().required('Drop location is required'),
    phone_number: yup
        .string()
        .matches(/^\d{10}$/, 'Phone number must be 10 digits')
        .required('Phone number is required'),
    shifting_date: yup.string().required('Shifting date is required'),
});
