import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CardModule, FormModule } from '@coreui/angular';

import { staffSchema } from '../../../schema/staff.schema';
import { validateYupSchema } from '../../../schema/yup-validator';
import { StaffService } from '../../../services/staff.service';
import { ToastService } from '../../../services/toast.service';
import { AppPaginationComponent } from '../../shared/pagination/pagination.component';
@Component({
  selector: 'app-staff-management',
  standalone: true,
  imports: [
    CommonModule,
    FormModule,
    CardModule,
    ReactiveFormsModule,
    AppPaginationComponent,
    FormsModule
  ],
  templateUrl: './staff-management.component.html',
  styleUrls: ['./staff-management.component.scss']
})
export class StaffManagementComponent implements OnInit {
  form: FormGroup;

  showStaffList = true;
  showAddForm = false;
  allStaff: any[] = [];
  paginatedStaff: any[] = [];
  currentPage = 1;
  itemsPerPage = 5;
  totalPages = 0;
  searchQuery: string = '';


  constructor(
    private fb: FormBuilder,
    private staffService: StaffService,
    private toast: ToastService
  ) {
    this.form = this.fb.group(
      {
        first_name: [''],
        last_name: [''],
        email: [''],
        password: [''],
        user_type: ['subadmin'],
        status: ['Active']
      },
      {

        validators: [validateYupSchema(staffSchema)]
      }
    );
  }
  ngOnInit(): void {
    this.loadStaffList();
  }

  private loadStaffList() {
    this.staffService.getAllStaff().subscribe(staff => {
      this.allStaff = staff;
      this.totalPages = Math.ceil(staff.length / this.itemsPerPage);
      this.setPaginatedStaff();
    });
  }

  openAddListForm() {
    this.showStaffList = false;
    this.showAddForm = true;
  }

  onPageChange(page: number) {
    this.currentPage = page;
    this.setPaginatedStaff();
  }


  onCancel() {
    this.showAddForm = false;
    this.showStaffList = true;
    // this.resetForm();
  }

  onSubmit() {
    this.form.markAllAsTouched();
    this.staffService.createStaff(this.form.value!).subscribe({
      next: (res) => {
        this.toast.success('Success', 'Staff added successfully');
        this.form.reset({ user_type: 'subadmin', status: 'Active' });
      },
      error: (err) => {
        if (err?.error?.message === 'Email already registered') {
          this.toast.error('error', 'Email is already in use');
        }
      }
    });
  }

  private setPaginatedStaff() {
    const query = this.searchQuery.toLowerCase().trim();

    const filtered = this.allStaff.filter((staff, index) =>
      (index + 1).toString().includes(query) || // S.No.
      (staff.first_name || '').toLowerCase().includes(query) ||
      (staff.last_name || '').toLowerCase().includes(query) ||
      (staff.email || '').toLowerCase().includes(query) ||
      (staff.user_type || '').toLowerCase().includes(query) ||
      (staff.status || '').toLowerCase().includes(query)
    );

    this.totalPages = Math.ceil(filtered.length / this.itemsPerPage);
    const start = (this.currentPage - 1) * this.itemsPerPage;
    this.paginatedStaff = filtered.slice(start, start + this.itemsPerPage);
  }


  onSearch() {
    this.currentPage = 1;
    this.setPaginatedStaff();
  }



}




