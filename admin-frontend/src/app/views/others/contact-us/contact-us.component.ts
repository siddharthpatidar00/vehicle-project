import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CardHeaderComponent, CardModule, FormModule } from '@coreui/angular';
import { IconModule } from '@coreui/icons-angular';
import { AppPaginationComponent } from '../../shared/pagination/pagination.component';
import { ConfirmModalComponent } from '../../shared/confirm-modal/confirm-modal.component';
import { ContactService, Contact } from '../../../services/contact.service';
import { ToastService } from '../../../services/toast.service';

@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.component.html',
  styleUrls: ['./contact-us.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormModule,
    CardModule,
    CardHeaderComponent,
    AppPaginationComponent,
    FormsModule,
    MatTooltipModule,
    IconModule,
    ConfirmModalComponent
  ]
})
export class ContactUsComponent implements OnInit {
  contacts: Contact[] = [];
  filteredContacts: Contact[] = [];
  selectedContactId: string | null = null;
  searchText: string = '';
  currentPage: number = 1;
  itemsPerPage: number = 10;

  constructor(private contactService: ContactService,private toast: ToastService) {}

  ngOnInit() {
    this.getAllContacts();
  }

  getAllContacts() {
    this.contactService.getAllContacts().subscribe({
      next: (res) => {
        this.contacts = res;
        this.filteredContacts = res;
      },
      error: (err) => this.toast.error('Error fetching contacts')
    });
  }

  openDeleteModal(contact: Contact) {
    this.selectedContactId = contact._id!;
  }

  handleConfirmDelete() {
    if (this.selectedContactId) {
      this.contactService.deleteContact(this.selectedContactId).subscribe({
        next: () => {
          this.getAllContacts();
          this.toast.success("Contact form delete")
          this.selectedContactId = null;
        },
        error: (err) => this.toast.error('Error deleting contact')
      });
    }
  }

  onPageChange(page: number) {
    this.currentPage = page;
  }

  get paginatedContact(): (Contact & { serial: number })[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredContacts
      .slice(start, start + this.itemsPerPage)
      .map((c, i) => ({ ...c, serial: start + i + 1 }));
  }

  get totalPages(): number {
    return Math.ceil(this.filteredContacts.length / this.itemsPerPage);
  }
  filterContacts() {
  const text = this.searchText.toLowerCase();
  this.filteredContacts = this.contacts.filter(c =>
    c.firstName.toLowerCase().includes(text) ||
    (c.message && c.message.toLowerCase().includes(text)) ||
    (c.lastName && c.lastName.toLowerCase().includes(text)) ||
    (c.email && c.email.toLowerCase().includes(text)) ||
    (c.mobile && c.mobile.toLowerCase().includes(text))
  );
  this.currentPage = 1; 
}

}
