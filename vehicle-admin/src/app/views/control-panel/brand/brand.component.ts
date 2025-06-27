import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule, CardModule } from '@coreui/angular';
import { IconModule } from '@coreui/icons-angular';
import { AppPaginationComponent } from '../../shared/pagination/pagination.component';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { BrandService, Brand } from '../../../services/brand.service';
import { brandSchema } from '../../../schema/brand.schema';
import { ConfirmModalComponent } from '../../shared/confirm-modal/confirm-modal.component'
import {ToastService} from '../../../services/toast.service'

@Component({
  selector: 'app-brand',
  standalone: true,
  imports: [
    CommonModule,
    CardModule,
    IconModule,
    ButtonModule,
    AppPaginationComponent,
    FormsModule,
    ReactiveFormsModule,
    ConfirmModalComponent
  ],
  templateUrl: './brand.component.html',
  styleUrl: './brand.component.scss',
})
export class BrandComponent implements OnInit {
  brandForm!: FormGroup;
  brands: Brand[] = [];
  currentPage = 1;
  itemsPerPage = 6;

  showModal = false;
  editMode = false;
  confirmVisible = false;
  confirmBrandId: string | null = null;
  selectedId: string | null = null;
  imagePreview: string | null = null;

  formErrors: Record<string, string> = {};
  submitted = false;

  newBrand: Partial<Brand> = {
    brand_name: '',
    brand_description: '',
    status: 'Active',
    brand_image: '',
  };

  brand = brandSchema;

  constructor(private brandService: BrandService, private fb: FormBuilder, private toast : ToastService ) { }

  ngOnInit() {
    this.loadBrands();

    this.brandForm = this.fb.group({
      brand_name: [''],
      brand_description: [''],
    });
  }

  get totalPages() {
    return Math.ceil(this.brands.length / this.itemsPerPage);
  }

  get paginatedBrands() {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    return this.brands.slice(start, start + this.itemsPerPage);
  }

  onPageChange(page: number) {
    this.currentPage = page;
  }

  loadBrands() {
    this.brandService.getAll().subscribe((data) => (this.brands = data));
  }

  openModal() {
    this.resetForm();
    this.editMode = false;
    this.showModal = true;
  }

  editBrand(brand: Brand) {
    this.editMode = true;
    this.selectedId = brand._id || null;
    this.newBrand = { ...brand };
    this.showModal = true;

    this.brandForm.patchValue({
      brand_name: brand.brand_name,
      brand_description: brand.brand_description,
    });
  }

  closeModal() {
    this.showModal = false;
    this.resetForm();
  }

  onSubmit() {
    this.submitted = true;
    this.formErrors = {};

    const dataToValidate = this.brandForm.getRawValue();

    this.brand
      .validate(dataToValidate, { abortEarly: false })
      .then(() => {
        const payload: Partial<Brand> = {
          ...this.newBrand,
          ...dataToValidate,
        };

        if (this.editMode && this.selectedId) {
          this.brandService
            .update(this.selectedId, payload as Brand)
            .subscribe(() => this.afterSubmit());
        } else {
          this.brandService
            .create(payload as Brand)
            .subscribe(() => this.afterSubmit());
        }
      })
      .catch((err) => {
        if (err.inner && Array.isArray(err.inner)) {
          for (const error of err.inner) {
            this.formErrors[error.path] = error.message;
            this.brandForm.get(error.path)?.setErrors({ message: error.message });
          }
        }
      });
  }

  afterSubmit() {
    this.loadBrands();
    this.closeModal();
      if (this.editMode) {
    this.toast.success('Success','Brand updated successfully');
  } else {
    this.toast.success('Success','Brand added successfully');
  }
  }

  deleteBrand(id: string) {
    this.confirmBrandId = id;
    this.confirmVisible = true;
  }

  handleConfirmDelete() {
    if (this.confirmBrandId) {
      this.brandService.delete(this.confirmBrandId).subscribe(() => {
        this.loadBrands();
        this.toast.success('Success','Brand deleted successfully');
        this.confirmVisible = false;
        this.confirmBrandId = null;
      });
    }
  }

  handleCancelDelete() {
    this.confirmVisible = false;
    this.confirmBrandId = null;
  }



  toggleStatus(brand: Brand) {
    if (!brand._id) return;
    const newStatus = brand.status === 'Active' ? 'Inactive' : 'Active';
    this.brandService.toggleStatus(brand._id, newStatus).subscribe({
      next: () => this.loadBrands(),
      error: (err) => this.toast.error('Failed to toggle status', err),
    });
  }

  resetForm() {
    this.newBrand = {
      brand_name: '',
      brand_description: '',
      status: 'Active',
      brand_image: '',
    };
    this.formErrors = {};
    this.submitted = false;
    this.imagePreview = null;
    this.brandForm?.reset();
  }


  getError(field: string) {
    const ctl = this.brandForm.get(field);
    return ctl?.errors?.['message'] || null;
  }

  onImageSelect(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length) {
      const file = input.files[0];
      this.newBrand.brand_image = file;

      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

}
