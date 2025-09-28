import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SellVehicle } from '../../../../Usershared/services/vehicle.sells.service';
import { VehicleInquiryService, PartialVehicleInquiry } from '../../../../Usershared/services/vehicle.inquiry.service';
import { TransportVehicleService,PartialTransportVehicle } from '../../../../Usershared/services/transport-vehicle.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  vehicleListings: SellVehicle[] = [];
  userEnquiries: PartialVehicleInquiry[] = [];
  myTransports: PartialTransportVehicle[] = [];

  constructor(private vehicleInquiryService: VehicleInquiryService, private transportService: TransportVehicleService) { }

  ngOnInit(): void {
    this.loadUserEnquiries();
    this.loadTransportEnquiry()
  }

loadTransportEnquiry(): void {
  this.transportService.getMyTransports().subscribe({
    next: (data) => {
      this.myTransports = data;
      console.log("User Transport:", this.myTransports);
    },
    error: (err) => {
      console.error("Error fetching transport:", err);
    }
  });
}




  loadUserEnquiries(): void {
    this.vehicleInquiryService.getUserEnquiries().subscribe({
      next: (data) => {
        this.userEnquiries = data;
        console.log("User Enquiries:", this.userEnquiries);
      },
      error: (err) => {
        console.error('Error fetching enquiries', err);
      }
    });
  }

}
