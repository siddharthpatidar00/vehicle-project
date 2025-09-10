import { Component, OnInit } from '@angular/core';
import { TransportVehicle, TransportVehicleService, TransportStatus } from '../../../services/transport.vehicle.service';
import { CommonModule } from '@angular/common';
import { CardBodyComponent, CardHeaderComponent, CardModule, FormModule } from '@coreui/angular';
import { AppPaginationComponent } from '../../shared/pagination/pagination.component';
import { ToastService } from "../../../services/toast.service"
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-transport-vehicle',
  standalone: true,
  imports: [CommonModule, FormModule, CardModule, CardHeaderComponent, CardBodyComponent, AppPaginationComponent, FormsModule],
  templateUrl: './transport-vehicle.component.html',
  styleUrl: './transport-vehicle.component.scss'
})
export class TransportVehicleComponent implements OnInit {
  transports: TransportVehicle[] = [];
  searchQuery: string = '';


  currentPage: number = 1;
  itemsPerPage: number = 10;

  statusOptions: TransportStatus[] = ['Pending', 'In Transit', 'Completed', 'Cancelled'];



  constructor(private transportService: TransportVehicleService, private toast: ToastService) { }

  ngOnInit() {
    this.loadTransports();
  }

  loadTransports() {
    this.transportService.getAllTransports().subscribe({
      next: (data) => {
        this.transports = data;
      },
      error: (err) => console.error('Error loading transports', err),
    });
  }


  updateTransportStatus(id: string, newStatus: TransportStatus) {
    const updateData: Partial<TransportVehicle> = { status: newStatus };
    this.transportService.updateTransport(id, updateData).subscribe({
      next: () => {
        this.toast.success( "Status updated successfully");
        this.loadTransports();
      },
      error: (err) => this.toast.error('Update failed'),
    });
  }




  get paginatedTransportVehicle(): (TransportVehicle & { serial: number })[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredLocation.slice(start, start + this.itemsPerPage);
  }



  onStatusChange(event: Event, id: string) {
    const newStatus = (event.target as HTMLSelectElement).value as TransportStatus;
    console.log('Selected:', newStatus);
    this.updateTransportStatus(id, newStatus);
  }



  get totalPages(): number {
    return Math.ceil(this.filteredLocation.length / this.itemsPerPage);
  }


  onPageChange(page: number): void {
    this.currentPage = page;
  }

  get filteredLocation(): (TransportVehicle & { serial: number })[] {
    const query = this.searchQuery.toLowerCase().trim();

    return this.transports
      .map((item, index) => ({
        ...item,
        serial: index + 1
      }))
      .filter(item =>
        item.pickup_location?.toLowerCase().includes(query) ||
        item.drop_location?.toLowerCase().includes(query) ||
        item.name?.toLowerCase().includes(query) ||
        item.phone_number?.toLowerCase().includes(query) ||
        item.shifting_date?.toLowerCase().includes(query) ||
        item.vehicle_detail?.toLowerCase().includes(query) ||
        item.status?.toLowerCase().includes(query) ||
        item.serial.toString().includes(query) 
      );
  }



}
