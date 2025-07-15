import { ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { AnyObjectSchema } from 'yup';

export function validateYupSchema(schema: AnyObjectSchema): ValidatorFn {
    return (group: AbstractControl): ValidationErrors | null => {
        // 1) Clear any previous Yup errors on each control
        Object.keys((group as any).controls || {}).forEach(key => {
            const ctrl = group.get(key);
            if (ctrl?.hasError('yup')) {
                ctrl.setErrors(null);
            }
        });

        // 2) Run full-form validation (abortEarly: false to collect all errors)
        try {
            schema.validateSync(group.value, { abortEarly: false });
            return null;
        } catch (err: any) {
            // 3) Assign each Yup error message onto its matching control
            err.inner.forEach((e: any) => {
                const ctrl = group.get(e.path);
                if (ctrl) {
                    ctrl.setErrors({ yup: e.message });
                }
            });
            // indicate the group is invalid
            return { yup: true };
        }
    };
}
