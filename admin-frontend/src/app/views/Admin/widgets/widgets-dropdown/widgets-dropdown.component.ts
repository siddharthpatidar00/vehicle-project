import {
  AfterContentInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit
} from '@angular/core';
import { getStyle } from '@coreui/utils';
import { ChartjsComponent } from '@coreui/angular-chartjs';
import { RouterLink } from '@angular/router';
import { RowComponent, ColComponent, WidgetStatAComponent, TemplateIdDirective } from '@coreui/angular';
import { forkJoin } from 'rxjs';
import { ChartType } from 'chart.js';

// Services
import { UsersService } from '../../../../services/users.service';
import { StaffService } from '../../../../services/staff.service';
import { VehicleCategoryService } from '../../../../services/vehicle.category.service';
import { BrandService } from '../../../../services/brand.service';
import { VehicleService } from '../../../../services/vehicle.service';
import { VehiclesEnquiryService } from '../../../../services/vehicles.enquiry.service';
import { TransportVehicleService } from '../../../../services/transport.vehicle.service';

@Component({
  selector: 'app-widgets-dropdown',
  standalone: true,
  templateUrl: './widgets-dropdown.component.html',
  styleUrls: ['./widgets-dropdown.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default,
  imports: [
    RowComponent,
    ColComponent,
    WidgetStatAComponent,
    TemplateIdDirective,
    ChartjsComponent,
    RouterLink
  ]
})
export class WidgetsDropdownComponent implements OnInit, AfterContentInit {
  titles: string[] = ['Users', 'Staff', 'Category', 'Brand', 'Vehicle', 'Enquiry', 'Transport'];
  colors: string[] = ['primary', 'info', 'warning', 'danger', '#006A67', '#9E4784', '#570530'];
  chartTypes: ChartType[] = ['line', 'line', 'line', 'bar', 'bar', 'bar', 'bar'];

  totalUsers = 0;
  totalStaff = 0;
  totalCategory = 0;
  totalBrand = 0;
  totalVehicle = 0;
  totalEnquiry = 0;
  totalTransport = 0;

  valueStrings: string[] = [];
  data: any[] = [];
  options: any[] = [];
  datasets: any[][] = [];

  labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  optionsDefault = {
    plugins: { legend: { display: false } },
    maintainAspectRatio: false,
    scales: {
      x: {
        border: { display: false },
        grid: { display: false, drawBorder: false },
        ticks: { display: false }
      },
      y: {
        min: 0,
        max: 100,
        display: false,
        grid: { display: false },
        ticks: { display: false }
      }
    },
    elements: {
      line: { borderWidth: 1, tension: 0.4 },
      point: { radius: 4, hitRadius: 10, hoverRadius: 4 }
    }
  };

  constructor(
    private cdr: ChangeDetectorRef,
    private usersService: UsersService,
    private staffService: StaffService,
    private vehicleCategoryService: VehicleCategoryService,
    private brandService: BrandService,
    private vehicleService: VehicleService,
    private vehiclesEnquiryService: VehiclesEnquiryService,
    private transportVehicleService: TransportVehicleService
  ) {}

  generateMonthData(value: number, index: number): number[] {
    const arr = new Array(12).fill(0);
    arr[index] = value || 0;
    return arr;
  }

  ngOnInit(): void {
    const nextMonth = (new Date().getMonth() + 1) % 12;

    forkJoin({
      users: this.usersService.getAll(),
      staff: this.staffService.getAllStaff(),
      category: this.vehicleCategoryService.getAll(),
      brand: this.brandService.getAll(),
      vehicle: this.vehicleService.getAll(),
      enquiry: this.vehiclesEnquiryService.getAll(),
      transport: this.transportVehicleService.getAllTransports(),
    }).subscribe({
      next: ({ users, staff, category, brand, vehicle, enquiry, transport }) => {
        this.totalUsers = users.length;
        this.totalStaff = staff.length;
        this.totalCategory = category.length;
        this.totalBrand = brand.length;
        this.totalVehicle = vehicle.length;
        this.totalEnquiry = enquiry.length;
        this.totalTransport = transport.length;

        this.valueStrings = [
          this.totalUsers.toString(),
          this.totalStaff.toString(),
          this.totalCategory.toString(),
          this.totalBrand.toString(),
          this.totalVehicle.toString(),
          this.totalEnquiry.toString(),
          this.totalTransport.toString()
        ];

        this.datasets = [
          [{
            label: 'Users',
            backgroundColor: 'transparent',
            borderColor: 'rgba(255,255,255,.55)',
            pointBackgroundColor: getStyle('--cui-primary'),
            pointHoverBorderColor: getStyle('--cui-primary'),
            data: this.generateMonthData(this.totalUsers, nextMonth),
            fill: false
          }],
          [{
            label: 'Staff',
            backgroundColor: 'transparent',
            borderColor: 'rgba(255,255,255,.55)',
            pointBackgroundColor: getStyle('--cui-info'),
            pointHoverBorderColor: getStyle('--cui-info'),
            data: this.generateMonthData(this.totalStaff, nextMonth),
            fill: false
          }],
          [{
            label: 'Category',
            backgroundColor: 'rgba(255,255,255,.2)',
            borderColor: 'rgba(255,255,255,.55)',
            pointBackgroundColor: getStyle('--cui-warning'),
            pointHoverBorderColor: getStyle('--cui-warning'),
            data: this.generateMonthData(this.totalCategory, nextMonth),
            fill: true
          }],
          [{
            label: 'Brand',
            backgroundColor: 'rgba(255,255,255,.2)',
            borderColor: 'rgba(255,255,255,.55)',
            data: this.generateMonthData(this.totalBrand, nextMonth),
            barPercentage: 0.7
          }],
          [{
            label: 'Vehicle',
            backgroundColor: 'rgba(255,255,255,.2)',
            borderColor: 'rgba(255,255,255,.55)',
            data: this.generateMonthData(this.totalVehicle, nextMonth),
            barPercentage: 0.7
          }],
          [{
            label: 'Enquiry',
            backgroundColor: 'rgba(255,255,255,.2)',
            borderColor: 'rgba(255,255,255,.55)',
            data: this.generateMonthData(this.totalEnquiry, nextMonth),
            barPercentage: 0.7
          }],
          [{
            label: 'Transport',
            backgroundColor: 'rgba(255,255,255,.2)',
            borderColor: 'rgba(255,255,255,.55)',
            data: this.generateMonthData(this.totalTransport, nextMonth),
            barPercentage: 0.7
          }]
        ];

        for (let i = 0; i < 7; i++) {
          this.data[i] = {
            labels: this.labels,
            datasets: this.datasets[i]
          };
          const options = JSON.parse(JSON.stringify(this.optionsDefault));
          if (this.chartTypes[i] === 'bar') {
            options.scales.y.min = undefined;
            options.scales.y.max = undefined;
            options.elements = {};
          }
          this.options[i] = options;
        }
      },
      error: err => console.error('Failed to load dashboard counts', err)
    });
  }

  ngAfterContentInit(): void {
    this.cdr.detectChanges();
  }
}