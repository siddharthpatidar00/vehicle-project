import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { VehiclesEnquiryService, VehiclesEnquiry } from '../../../services/vehicles.enquiry.service';
import {
  ButtonDirective,
  CardBodyComponent,
  CardHeaderComponent,
  CardModule,
  DropdownComponent,
  DropdownItemDirective,
  DropdownMenuDirective,
  DropdownToggleDirective
} from '@coreui/angular';
import { AppPaginationComponent } from '../../shared/pagination/pagination.component';
import { IconModule } from '@coreui/icons-angular';
import { ToastService } from '../../../services/toast.service';

@Component({
  selector: 'app-vehicles-enquiry',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CardModule,
    CardHeaderComponent,
    CardBodyComponent,
    AppPaginationComponent,
    DropdownComponent,
    DropdownItemDirective,
    DropdownMenuDirective,
    DropdownToggleDirective,
    ButtonDirective,
    IconModule
  ],
  templateUrl: './vehicles-enquiry.component.html',
  styleUrl: './vehicles-enquiry.component.scss'
})
export class VehiclesEnquiryComponent implements OnInit {
  paginatedCategories: VehiclesEnquiry[] = [];
  currentPage = 1;
  itemsPerPage = 10;
  totalPages = 1;
  enquiries: VehiclesEnquiry[] = [];
  selectedEnquiry: VehiclesEnquiry | null = null;
  searchTerm = '';
  filterStatus = '';
  statuses: string[] = ['New', 'In Progress', 'Closed'];
  confirmModalVisible: boolean = false;
  statusToUpdate: 'New' | 'In Progress' | 'Closed' | null = null;
  enquiryToUpdate: VehiclesEnquiry | null = null;
  selectedFile: File | null = null;
  previewImage: string | null = null;
  editEnquiry: VehiclesEnquiry | null = null;
  activeTab: 'general' | 'loan' | 'delivery' | 'delivered' = 'general';
  showViewModal: boolean = false;


  constructor(private enquiryService: VehiclesEnquiryService, private toast: ToastService) { }

  ngOnInit() {
    this.loadEnquiries();
  }

  loadEnquiries() {
    this.enquiryService.getAll().subscribe(data => {
      this.enquiries = data.sort(
        (a, b) => new Date(b.created_date).getTime() - new Date(a.created_date).getTime()
      );
    });
  }


  get filteredEnquiries() {
    const query = this.searchTerm.toLowerCase().trim();

    return this.enquiries
      .filter((enquiry, index) =>
        (enquiry.name || '').toLowerCase().includes(query) ||
        (enquiry.email || '').toLowerCase().includes(query) ||
        (enquiry.phone_number || '').toLowerCase().includes(query) ||
        (enquiry.status || '').toLowerCase().includes(query) ||
        (index + 1).toString().includes(query)
      )
      .filter(enquiry =>
        this.filterStatus === '' || enquiry.status === this.filterStatus
      );
  }


  updateStatus(id: string, status: string) {
    this.enquiryService.updateStatus(id, status).subscribe(() => { });
  }

  changeStatus(enquiry: VehiclesEnquiry, newStatus: 'New' | 'In Progress' | 'Closed') {
    enquiry.status = newStatus;

    if (this.editEnquiry && enquiry._id === this.editEnquiry._id) {
      this.editEnquiry.status = newStatus;
    }
  }

  saveEnquiry() {
    if (this.editEnquiry && this.editEnquiry._id) {
      const id = this.editEnquiry._id;

      this.enquiryService.updateEnquiry(id, this.editEnquiry).subscribe({
        next: () => {
          this.toast.success('Enquiry updated successfully');
          this.loadEnquiries();
          this.editEnquiry = null;
        },
        error: () => {
          this.toast.error('Failed to update enquiry');
        }
      });
    }
  }

  confirmStatusUpdate() {
    if (this.enquiryToUpdate && this.statusToUpdate) {
      this.updateStatus(this.enquiryToUpdate._id, this.statusToUpdate);

      if (this.editEnquiry && this.editEnquiry._id === this.enquiryToUpdate._id) {
        this.editEnquiry.status = this.statusToUpdate;
      }

      this.closeConfirmModal();
    }
  }

  closeConfirmModal() {
    this.confirmModalVisible = false;
    this.statusToUpdate = null;
    this.enquiryToUpdate = null;
  }

  viewDetails(enquiry: VehiclesEnquiry) {
    this.selectedEnquiry = enquiry;
    this.showViewModal = true;
  }

  closeViewModal() {
    this.showViewModal = false;
    this.selectedEnquiry = null;
  }


  onPageChange(page: number) {
    this.currentPage = page;
  }

  editDetails(enquiry: VehiclesEnquiry) {
    this.editEnquiry = { ...enquiry };
    if (this.editEnquiry.expected_delivery_date) {
      const date = new Date(this.editEnquiry.expected_delivery_date);
      this.editEnquiry.expected_delivery_date = date.toISOString().split('T')[0];
    }
    if (this.editEnquiry.delivered_date) {
      const date = new Date(this.editEnquiry.delivered_date);
      this.editEnquiry.delivered_date = date.toISOString().split('T')[0];
    }

    this.activeTab = 'general';
    this.selectedEnquiry = null;
  }

  closeEditModal() {
    this.editEnquiry = null;
  }

  setTab(tab: string) {
    if (['general', 'loan', 'delivery', 'delivered'].includes(tab)) {
      this.activeTab = tab as 'general' | 'loan' | 'delivery' | 'delivered';
    }
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;

    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];

      const reader = new FileReader();
      reader.onload = (e: any) => {
        if (this.editEnquiry) {
          this.editEnquiry.delivery_proof = e.target.result;
        }
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }

  openPreview(imagePath: string | undefined) {
    if (!imagePath) return;

    this.previewImage = imagePath.startsWith('data')
      ? imagePath
      : 'http://localhost:5000/uploads/' + imagePath;
  }

  closePreview() {
    this.previewImage = null;
  }
}
