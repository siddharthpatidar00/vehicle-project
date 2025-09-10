import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { CardHeaderComponent, CardModule, FormModule } from '@coreui/angular';
import { AppPaginationComponent } from '../../shared/pagination/pagination.component';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { MatTooltipModule } from '@angular/material/tooltip';
import { IconModule } from '@coreui/icons-angular';
import { ConfirmModalComponent } from "../../shared/confirm-modal/confirm-modal.component";
import { ToastService } from '../../../services/toast.service';
import { HappyCustomerService, HappyCustomer } from '../../../services/happy.customer.service';
import { happyCustomerSchema } from '../../../schema/happy.customer.schema';

@Component({
  selector: 'app-happy-customer',
  standalone: true,
  imports: [
    CommonModule,
    FormModule,
    CardModule,
    CardHeaderComponent,
    AppPaginationComponent,
    FormsModule,
    ReactiveFormsModule,
    MatTooltipModule,
    IconModule,
    ConfirmModalComponent
  ],
  templateUrl: './happy-customer.component.html',
  styleUrls: ['./happy-customer.component.scss']
})
export class HappyCustomerComponent implements OnInit {
  customers: HappyCustomer[] = [];
  searchText: string = '';
  currentPage = 1;
  itemsPerPage = 5;

  showModal = false;
  editMode = false;
  selectedCustomerId: string | null = null;

  happyCustomerForm!: FormGroup;
  formErrors: Record<string, string> = {};
  submitted = false;

  imagePreview: string | ArrayBuffer | null = null;
  selectedFile: File | null = null;

  constructor(
    private fb: FormBuilder,
    private customerService: HappyCustomerService,
    private toast: ToastService
  ) { }

  ngOnInit() {
    this.loadCustomers();
    this.happyCustomerForm = this.fb.group({
      name: [''],
      message: [''],
      image: [null]
    });
  }

  loadCustomers() {
    this.customerService.getAllCustomers().subscribe({
      next: (data) => {
        this.customers = data.map(c => ({
          ...c,
          image: c.image?.startsWith('http') ? c.image : `http://localhost:5000${c.image}`
        }));
      },
      error: (err) => console.error('Error fetching customers:', err)
    });
  }

  get filteredCustomers() {
    const query = this.searchText.toLowerCase().trim();
    return this.customers.filter(c =>
      c.name.toLowerCase().includes(query) ||
      c.message.toLowerCase().includes(query)
    );
  }

  get paginatedCustomers() {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredCustomers.slice(start, start + this.itemsPerPage)
      .map((c, i) => ({ ...c, serial: start + i + 1 }));
  }

  get totalPages() {
    return Math.ceil(this.filteredCustomers.length / this.itemsPerPage);
  }

  onPageChange(page: number) {
    this.currentPage = page;
  }

  openAddModal() {
    this.resetForm();
    this.editMode = false;
    this.showModal = true;
  }

openEditModal(customer: HappyCustomer) {
  this.resetForm();
  this.editMode = true;
  this.showModal = true;
  this.selectedCustomerId = customer._id || null;

  // Keep existing image in preview
  this.imagePreview = customer.image;

  this.happyCustomerForm.patchValue({
    name: customer.name,
    message: customer.message,
    image: null // file input starts empty
  });
}


  onImageSelect(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.selectedFile = file;
      this.happyCustomerForm.patchValue({ image: file });
      const reader = new FileReader();
      reader.onload = () => this.imagePreview = reader.result;
      reader.readAsDataURL(file);
    }
  }

 onSubmit() {
  this.submitted = true;
  this.formErrors = {};

  happyCustomerSchema(this.editMode).validate(this.happyCustomerForm.value, { abortEarly: false })
    .then(() => {
      const formDataObj = new FormData();
      formDataObj.append('name', this.happyCustomerForm.value.name);
      formDataObj.append('message', this.happyCustomerForm.value.message);

      // Only add new file if selected
      if (this.selectedFile) {
        formDataObj.append('image', this.selectedFile);
      }

      if (this.editMode && this.selectedCustomerId) {
        this.customerService.updateCustomer(this.selectedCustomerId, formDataObj)
          .subscribe(() => this.afterSubmit());
      } else {
        this.customerService.createCustomer(formDataObj)
          .subscribe(() => this.afterSubmit());
      }
    })
    .catch(err => {
      if (err.inner && Array.isArray(err.inner)) {
        for (const error of err.inner) {
          this.formErrors[error.path] = error.message;
          this.happyCustomerForm.get(error.path)?.setErrors({ message: error.message });
        }
      }
    });
}


  afterSubmit() {
    this.loadCustomers();
    this.closeModal();
    if (this.editMode) {
      this.toast.success('Customer updated successfully');
    } else {
      this.toast.success('Customer added successfully');
    }
  }

  openDeleteModal(customer: HappyCustomer) {
    this.selectedCustomerId = customer._id || null;
  }

  handleConfirmDelete() {
    if (this.selectedCustomerId) {
      this.customerService.deleteCustomer(this.selectedCustomerId).subscribe({
        next: () => {
          this.loadCustomers();
          this.toast.success('Customer deleted successfully');
          this.selectedCustomerId = null;
        },
        error: () => this.toast.error('Failed to delete customer')
      });
    }
  }

  closeModal() {
    this.showModal = false;
    this.resetForm();
  }

 resetForm() {
  this.selectedFile = null;

  // Only reset image preview if not editing
  if (!this.editMode) {
    this.imagePreview = null;
  }

  this.formErrors = {};
  this.submitted = false;
  this.selectedCustomerId = null;
  this.happyCustomerForm?.reset();
}


  getError(field: string) {
    const ctl = this.happyCustomerForm.get(field);
    return ctl?.errors?.['message'] || null;
  }
}
