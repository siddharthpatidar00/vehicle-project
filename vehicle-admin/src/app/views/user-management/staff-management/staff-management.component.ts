import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CardModule, FormModule } from '@coreui/angular';

import { staffSchema } from '../../../schema/staff.schema';
import { validateYupSchema } from '../../../schema/yup-validator';
import { StaffService } from '../../../services/staff.service';
import { ToastService } from '../../../services/toast.service';

@Component({
  selector: 'app-staff-management',
  standalone: true,
  imports: [
    CommonModule,
    FormModule,
    CardModule,
    ReactiveFormsModule
  ],
  templateUrl: './staff-management.component.html',
  styleUrls: ['./staff-management.component.scss']
})
export class StaffManagementComponent {
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private staffService: StaffService,
    private toast: ToastService
  ) {
    this.form = this.fb.group(
      {
        first_name: [''],
        last_name:  [''],
        email:      [''],
        password:   [''],
        user_type:  ['subadmin'],
        status:     ['Active']
      },
      {

        validators: [ validateYupSchema(staffSchema) ]
      }
    );
  }

onSubmit() {
    this.form.markAllAsTouched();
    this.staffService.createStaff(this.form.value!).subscribe({
      next: (res) => {
        this.toast.success('Success','Staff added successfully');
        this.form.reset({ user_type: 'subadmin', status: 'Active' });
      },
      error: (err) => {
        if (err?.error?.message === 'Email already registered') {
          this.toast.error('error','Email is already in use');
        } 
      }
    });
  }
}
