import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppPaginationComponent } from '../../shared/pagination/pagination.component';
import { IconModule } from '@coreui/icons-angular';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CardModule } from '@coreui/angular';
import { VehicleCategoryService, VehicleCategory } from '../../../services/vehicle.category.service';
import { vehicleCategorySchema } from '../../../schema/vehicles.category.schema';
import { ConfirmModalComponent } from '../../shared/confirm-modal/confirm-modal.component';
import { ToastService } from '../../../services/toast.service';

@Component({
  selector: 'app-vehicles-category',
  standalone: true,
  templateUrl: './vehicles-category.component.html',
  styleUrls: ['./vehicles-category.component.scss'],
  imports: [CommonModule, AppPaginationComponent, ConfirmModalComponent, IconModule, FormsModule, ReactiveFormsModule, CardModule],
})
export class VehiclesCategoryComponent implements OnInit {
  vehicleCategoryForm!: FormGroup;
  vehicleCategories: VehicleCategory[] = [];
  currentPage = 1;
  itemsPerPage = 6;

  showModal = false;
  editMode = false;
  editId: string | null = null;
  selectedImageFile: File | null = null;
  confirmVisible = false;
  categoryServiceId: string | null = null;
  imagePreview: string | null = null;
  submitted = false;
  formErrors: Record<string, string> = {};

  newCategory: Partial<VehicleCategory> = {
    _id: '',
    category_name: '',
    category_description: '',
    status: 'Active',
    category_image: '',
  };

  vehicleCategory = vehicleCategorySchema;

  constructor(private categoryService: VehicleCategoryService, private fb: FormBuilder, private toast: ToastService) { }


  ngOnInit() {
    this.loadCategories()
    this.vehicleCategoryForm = this.fb.group({
      category_name: [''],
      category_description: [''],
    })
  }

    onPageChange(page: number) {
    this.currentPage = page;
  }

  loadCategories(){
    this.categoryService.getAll().subscribe((data) => (this.vehicleCategories = data))
  }

  get totalPages() {
    return Math.ceil(this.vehicleCategories.length / this.itemsPerPage);
  }

  get paginatedCategories() {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    return this.vehicleCategories.slice(start, start + this.itemsPerPage);
  }


  openModal() {
    this.resetForm();
    this.editMode = false;
    this.showModal = true;
  }

  editCategory(category: VehicleCategory) {
    this.editMode = true;
    this.editId = category._id || null;
    this.newCategory = {...category};
    this.showModal = true;

    this.vehicleCategoryForm.patchValue({
      category_name: category.category_name,
      category_description: category.category_description,
    });

  }


  closeModal() {
    this.showModal = false;
    this.resetForm();
  }

  onSubmit() {
    this.submitted = true;
    this.formErrors = {};

    const dataToValidate = this.vehicleCategoryForm.getRawValue();

    this.vehicleCategory
      .validate(dataToValidate, { abortEarly: false })
      .then(() => {
        const payload: Partial<VehicleCategory> = {
          ...this.newCategory,
          ...dataToValidate,
        };
        if(this.editMode && this.editId){
          this.categoryService
          .update(this.editId,payload as VehicleCategory)
          .subscribe(()=> this.afterSubmit())
        }else{
          this.categoryService
          .create(payload as VehicleCategory)
          .subscribe(() => this.afterSubmit())
        }
      })
      .catch((err) => {
        if (err.inner && Array.isArray(err.inner)) {
          for (const error of err.inner) {
            this.formErrors[error.path] = error.message;
            this.vehicleCategoryForm.get(error.path)?.setErrors({message: error.message})
          }
        }
      });
  }

  afterSubmit() {
    this.loadCategories();
    this.closeModal();
    if (this.editMode) {
      this.toast.success('Success', 'Category updated successfully');
    } else {
      this.toast.success('Success', 'Category added successfully');
    }
  }

  deleteCategory(id: string) {
    this.categoryServiceId = id;
    this.confirmVisible = true;
  }

  handleConfirmDelete() {
    if (this.categoryServiceId) {
      this.categoryService.delete(this.categoryServiceId).subscribe(() => {
        this.loadCategories();
        this.toast.success('Success', 'Category deleted successfully');
        this.confirmVisible = false;
        this.categoryServiceId = null;
      });
    }
  }

  handleCancelDelete() {
    this.confirmVisible = false;
    this.categoryServiceId = null;
  }


  toggleStatus(category: VehicleCategory) {
    const newStatus = category.status === 'Active' ? 'Inactive' : 'Active';
    this.categoryService.updateStatus(category._id!, newStatus).subscribe({
      next: () => this.loadCategories(),
      error: (err) => console.error('Error updating status', err),
    });
  }

  resetForm() {
    this.newCategory = {
      category_name: '',
      category_description: '',
      status: 'Active',
      category_image: '',
    };

    this.vehicleCategoryForm?.reset();
    this.formErrors = {};
    this.submitted = false;
    this.imagePreview = null
  }
  
  getError(field: string) {
    const ctl = this.vehicleCategoryForm.get(field);
    return ctl?.errors?.['message'] || null;
  }

  onImageSelect(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length) {
      const file = input.files[0];
      this.newCategory.category_image = file
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

}
