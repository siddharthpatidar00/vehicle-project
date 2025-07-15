import { ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { AnyObjectSchema } from 'yup';

export function validateYupSchema(schema: AnyObjectSchema): ValidatorFn {
    return (group: AbstractControl): ValidationErrors | null => {
        Object.keys((group as any).controls || {}).forEach(key => {
            const ctrl = group.get(key);
            if (ctrl?.hasError('yup')) {
                ctrl.setErrors(null);
            }
        });

        try {
            schema.validateSync(group.value, { abortEarly: false });
            return null;
        } catch (err: any) {
            err.inner.forEach((e: any) => {
                const ctrl = group.get(e.path);
                if (ctrl) {
                    ctrl.setErrors({ yup: e.message });
                }
            });
            return { yup: true };
        }
    };
}
