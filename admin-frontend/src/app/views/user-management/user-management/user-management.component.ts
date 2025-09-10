import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CardModule } from '@coreui/angular';
import { UsersService, User } from '../../../services/users.service';
import { ToastService } from '../../../services/toast.service';
import { userSchema } from '../../../schema/user.schema';
import { IconModule } from '@coreui/icons-angular';
import { AppPaginationComponent } from '../../shared/pagination/pagination.component';
import { ConfirmModalComponent } from "../../shared/confirm-modal/confirm-modal.component";

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, CardModule, IconModule, AppPaginationComponent, ConfirmModalComponent],
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.scss'],
})
export class UserManagementComponent implements OnInit {
  userForm!: FormGroup;
  submitted = false;
  users: User[] = [];
  editMode = false;
  editUserId: string | null = null;
  showForm = false;
  schema = userSchema;
  showUserList = true;
  showAddUserForm = false;
  currentPage = 1;
  itemsPerPage = 5;
  searchTerm: string = '';
  showViewModal = false;
  selectedUser: User | null = null;
  confirmVisible = false;
  confirmUserId: string | null = null;


  constructor(
    private fb: FormBuilder,
    private usersService: UsersService,
    private toast: ToastService
  ) { }

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
    this.usersService.getAll().subscribe({
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
      this.usersService.update(this.editUserId, payload).subscribe({
        next: () => {
          this.toast.success('User updated successfully');
          this.resetForm();
          this.loadUsers();
        },
        error: (err) =>
          this.toast.error('Error updating user'),
      });
    } else {
      this.usersService.register(payload).subscribe({
        next: () => {
          this.toast.success('User created successfully');
          this.resetForm();
          this.loadUsers();
        },
        error: (err) =>
          this.toast.error('Error creating user'),
      });
    }
  }

  openAddUserForm() {
    this.showUserList = false;
    this.showAddUserForm = true;
    this.showForm = true;
    this.resetForm();
  }

  onCancel() {
    this.showForm = false;
    this.showUserList = true;
    this.showAddUserForm = false;
    this.resetForm();
  }

  openViewModal(user: User) {
    this.selectedUser = user;
    this.showViewModal = true;
  }

  closeViewModal() {
    this.showViewModal = false;
    this.selectedUser = null;
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

    this.showUserList = false;
    this.showForm = true;
  }


onDelete(id: string) {
  this.confirmUserId = id;
  this.confirmVisible = true;
}



 handleConfirmDelete() {
    if (this.confirmUserId) {
      this.usersService.delete(this.confirmUserId).subscribe({
        next: () => {
          this.toast.success('User deleted successfully');
          this.loadUsers();
          this.confirmVisible = false;
          this.confirmUserId = null;
        },
        error: (err) => {
          this.toast.error('Error deleting user');
          this.confirmVisible = false;
        }
      });
    }
  }

  handleCancelDelete() {
    this.confirmVisible = false;
    this.confirmUserId = null;
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

  get totalPages(): number {
    return Math.ceil(this.users.length / this.itemsPerPage);
  }


  onPageChange(page: number) {
    this.currentPage = page;
  }

  get paginatedUsers(): User[] {
    const query = this.searchTerm.toLowerCase().trim();

    const filtered = this.users.filter((user, index) =>
      ((index + 1).toString().includes(query)) || // S.No.
      (user.first_name || '').toLowerCase().includes(query) ||
      (user.last_name || '').toLowerCase().includes(query) ||
      (user.company || '').toLowerCase().includes(query) ||
      (user.city || '').toLowerCase().includes(query) ||
      (user.status || '').toLowerCase().includes(query)
    );

    const start = (this.currentPage - 1) * this.itemsPerPage;
    return filtered.slice(start, start + this.itemsPerPage);
  }

}
