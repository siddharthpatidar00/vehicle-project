import * as yup from 'yup';

export const advertisementSchema = (isEdit: boolean = false) => yup.object({
    type: yup
        .string()
        .required('Advertisement type is required.')
        .oneOf(['ad1', 'ad2', 'ad3'], 'Invalid advertisement type.'),

    imageTitle: yup
        .string()
        .required('Image title is required.'),

    startDate: yup
        .date()
        .required('Start date is required.'),

    endDate: yup
        .date()
        .required('End date is required.'),

    image: isEdit
        ? yup.mixed()  
        : yup.mixed().required('Image is required.')  
});
