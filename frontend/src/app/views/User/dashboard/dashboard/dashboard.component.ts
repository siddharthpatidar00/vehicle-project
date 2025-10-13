import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Vehicle } from '../../../../services/vehicle.service';
import { VehiclesEnquiryService, VehiclesEnquiry } from '../../../../services/vehicles.enquiry.service';
import { TransportVehicleService, TransportVehicle } from '../../../../services/transport.vehicle.service';
import { LoanService, Loan } from '../../../../services/loan.service';
import { InsuranceService,Insurance } from '../../../../services/insurance.service';
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  vehicleListings: Vehicle[] = [];
  userEnquiries: VehiclesEnquiry[] = [];
  loan: Loan[] = []
  insurance: Insurance[] = []
  myTransports: TransportVehicle[] = [];

  constructor(private vehicleInquiryService: VehiclesEnquiryService, private transportService: TransportVehicleService, private loanService: LoanService,private insuranceService: InsuranceService) { }

  ngOnInit(): void {
    this.loadUserEnquiries();
    this.loadMyTransports()
    this.loadUserLoan()
    this.loadUserInsurance()
  }

  loadMyTransports(): void {
    this.transportService.getMyTransports().subscribe({
      next: (data) => {
        this.myTransports = data;
        console.log("My Transports:", this.myTransports);
      },
      error: (err) => {
        console.error('Error fetching transports', err);
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

loadUserLoan(): void {
    this.loanService.getMyLoanInquiries().subscribe({
      next: (loans: Loan[]) => { 
        this.loan = loans;
        console.log("User loan Enquiries:", this.loan);
      },
      error: (err) => {
        console.error('Error fetching enquiries', err);
      }
    });
}


loadUserInsurance(): void {
    this.insuranceService.getMyInsuranceInquiries().subscribe({
      next: (insurance: Insurance[]) => { 
        this.insurance = insurance;
        console.log("User insurance enquiries:", this.insurance);
      },
      error: (err) => {
        console.error('Error fetching insurances', err);
      }
    });
}


}
