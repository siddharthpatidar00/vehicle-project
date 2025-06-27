import { Component, OnInit } from '@angular/core';
import { TransportVehicle, TransportVehicleService, TransportStatus } from '../../../services/transport.vehicle.service';
import { CommonModule } from '@angular/common';
import { CardBodyComponent, CardHeaderComponent, CardModule, FormModule } from '@coreui/angular';
import { AppPaginationComponent } from '../../shared/pagination/pagination.component';
import { ToastService } from "../../../services/toast.service"

@Component({
  selector: 'app-transport-vehicle',
  standalone: true,
  imports: [CommonModule, FormModule, CardModule, CardHeaderComponent, CardBodyComponent, AppPaginationComponent],
  templateUrl: './transport-vehicle.component.html',
  styleUrl: './transport-vehicle.component.scss'
})
export class TransportVehicleComponent implements OnInit {
  transports: TransportVehicle[] = [];

  currentPage: number = 1;
  itemsPerPage: number = 10;

statusOptions: TransportStatus[] = ['Pending', 'In Transit', 'Completed', 'Cancelled'];



  constructor(private transportService: TransportVehicleService, private toast:ToastService) { }

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
      this.toast.success('success',"Status updated successfully");
      this.loadTransports();
    },
    error: (err) => this.toast.error('error','Update failed'),
  });
}




  get paginatedTransportVehicle(): TransportVehicle[] {
    return this.transports;
  }

  onStatusChange(event: Event, id: string) {
    const newStatus = (event.target as HTMLSelectElement).value as TransportStatus;
    console.log('Selected:', newStatus);
    this.updateTransportStatus(id, newStatus);
  }



  get totalPages(): number {
    return Math.ceil(this.transports.length / this.itemsPerPage);
  }

  onPageChange(page: number): void {
    this.currentPage = page;
  }

}
