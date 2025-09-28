import * as yup from 'yup';

export const LoanInquirySchema = yup.object().shape({
    fullName: yup.string().required('Full name is required'),
    // email: yup.string().required('Email is required'),
    mobile: yup.string().required('Mobile number is required'),
    // loanAmount: yup
    //     .number()
    //     .transform((value, originalValue) => (originalValue === '' ? undefined : value))
    //     .required('Loan Amount is required'),
    // tenure: yup
    //     .number()
    //     .transform((value, originalValue) => (originalValue === '' ? undefined : value))
    //     .required('Tenure is required'),
    // annualIncome: yup
    //     .number()
    //     .transform((value, originalValue) => (originalValue === '' ? undefined : value))
    //     .required('Annual income is required'),
    // vehicleDetail: yup.string().required('Vehicle detail is required')
});
