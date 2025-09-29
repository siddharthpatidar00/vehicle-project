import * as yup from 'yup';

export const InsuranceSchema = yup.object().shape({
    fullName: yup.string().required('Full name is required'),
    mobile: yup.string().required('Mobile number is required'),
    // policyNumber: yup
    //     .number()
    //     .transform((value, originalValue) => (originalValue === '' ? undefined : value))
    //     .required('Policy number is required'),
    // insuranceType: yup.string().required('Insurance type is required'),
    // vehicleDetail: yup.string().required('Vehicle detail is required')
});
