import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CardModule } from '@coreui/angular';
import { BrandService, User } from '../../../services/users.service';
import { ToastService } from '../../../services/toast.service';
import { userSchema } from '../../../schema/user.schema'; 
@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, CardModule],
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.scss'],
})
export class UserManagementComponent implements OnInit {
  userForm!: FormGroup;
  submitted = false;
  users: User[] = [];
  editMode = false;
  editUserId: string | null = null;

  schema = userSchema; 

  constructor(
    private fb: FormBuilder,
    private brandService: BrandService,
    private toast: ToastService
  ) {}

  ngOnInit(): void {
    this.userForm = this.fb.group({
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      gender: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      mobile: [''],
      company: [''],
      gst: [''],
      pan: [''],
      dob: [''],
      aadhar: [''],
      city: [''],
      address: [''],
      status: [''],
    });
    this.loadUsers();
  }

  loadUsers() {
    this.brandService.getAll().subscribe({
      next: (list) => (this.users = list),
      error: (err) => console.error('Failed to load users', err),
    });
  }

  async onSubmit() {
  this.submitted = true;

  try {
    await this.schema.validate(this.userForm.value, { abortEarly: false });
  } catch (err: any) {
    err.inner.forEach((error: any) => {
      this.userForm.get(error.path)?.setErrors({ message: error.message });
    });
    return;
  }


  const formValue = { ...this.userForm.value };
  formValue.status = formValue.status === '' ? null : formValue.status;

  const payload: Partial<User> = formValue;
  console.log('Payload sent to backend:', payload);

  if (this.editMode && this.editUserId) {
    this.brandService.update(this.editUserId, payload).subscribe({
      next: () => {
        this.toast.success('Success', 'User updated successfully');
        this.resetForm();
        this.loadUsers();
      },
      error: (err) =>
        this.toast.error('Error updating user', err.error?.message || err.message || 'Unknown error'),
    });
  } else {
    this.brandService.register(payload).subscribe({
      next: () => {
        this.toast.success('Success', 'User created successfully');
        this.resetForm();
        this.loadUsers();
      },
      error: (err) =>
        this.toast.error('Error creating user', err.error?.message || err.message || 'Unknown error'),
    });
  }
}


  onEdit(user: User) {
    this.editMode = true;
    this.editUserId = user._id || null;
    this.userForm.patchValue({
      first_name: user.first_name,
      last_name: user.last_name,
      gender: user.gender,
      email: user.email,
      password: '',
      mobile: user.mobile || '',
      company: user.company || '',
      gst: user.gst || '',
      pan: user.pan || '',
      dob: user.dob ? user.dob.split('T')[0] : '',
      aadhar: user.aadhar || '',
      city: user.city || '',
      address: user.address || '',
      status: user.status || '',
    });
  }

  onDelete(id: string) {
    if (!confirm('Are you sure you want to delete this user?')) return;
    this.brandService.delete(id).subscribe({
      next: () => this.loadUsers(),
      error: (err) => console.error('Delete failed', err),
    });
  }

  resetForm() {
    this.userForm.reset();
    this.submitted = false;
    this.editMode = false;
    this.editUserId = null;
  }

  getError(field: string) {
    const ctl = this.userForm.get(field);
    return ctl?.errors?.['message'] || null;
  }
}
