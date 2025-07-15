// import {
//   AfterContentInit,
//   AfterViewInit,
//   ChangeDetectionStrategy,
//   ChangeDetectorRef,
//   Component,
//   OnInit,
//   ViewChild
// } from '@angular/core';
// import { getStyle } from '@coreui/utils';
// import { ChartjsComponent } from '@coreui/angular-chartjs';
// import { RouterLink } from '@angular/router';
// import { RowComponent, ColComponent, WidgetStatAComponent, TemplateIdDirective } from '@coreui/angular';
// // new data
// import { UsersService } from '../../../services/users.service';
// import { StaffService } from "../../../services/staff.service"
// import { VehicleCategoryService } from '../../../services/vehicle.category.service';
// import { BrandService } from '../../../services/brand.service';
// import { VehicleService } from '../../../services/vehicle.service';
// import { VehiclesEnquiryService } from '../../../services/vehicles.enquiry.service';
// import { TransportVehicleService } from '../../../services/transport.vehicle.service';

// @Component({
//   selector: 'app-widgets-dropdown',
//   templateUrl: './widgets-dropdown.component.html',
//   styleUrls: ['./widgets-dropdown.component.scss'],
//   changeDetection: ChangeDetectionStrategy.Default,
//   imports: [RowComponent, ColComponent, WidgetStatAComponent, TemplateIdDirective, ChartjsComponent,RouterLink]
// })
// export class WidgetsDropdownComponent implements OnInit, AfterContentInit {

//   constructor(
//     private changeDetectorRef: ChangeDetectorRef,
//     // new data
//     private usersService: UsersService,
//     private staffService: StaffService,
//     private vehicleCategoryService: VehicleCategoryService,
//     private brandService: BrandService,
//     private vehicleService: VehicleService,
//     private vehiclesEnquiryService: VehiclesEnquiryService,
//     private transportVehicleService: TransportVehicleService
//   ) { }

//   // new data
//   totalUsers: number = 0
//   totalStaff: number = 0
//   totalCategory: number = 0
//   totalBrand: number = 0
//   totalVehicle: number = 0
//   totalEnquiry: number = 0
//   totalTransport: number = 0

//   data: any[] = [];
//   options: any[] = [];
//   labels = [
//     'January',
//     'February',
//     'March',
//     'April',
//     'May',
//     'June',
//     'July',
//     'August',
//     'September',
//     'October',
//     'November',
//     'December',
//     'January',
//     'February',
//     'March',
//     'April'
//   ];
//   datasets = [
//     [{
//       label: 'My First dataset',
//       backgroundColor: 'transparent',
//       borderColor: 'rgba(255,255,255,.55)',
//       pointBackgroundColor: getStyle('--cui-primary'),
//       pointHoverBorderColor: getStyle('--cui-primary'),
//       data: [65, 59, 84, 84, 51, 55, 40]
//     }], [{
//       label: 'My Second dataset',
//       backgroundColor: 'transparent',
//       borderColor: 'rgba(255,255,255,.55)',
//       pointBackgroundColor: getStyle('--cui-info'),
//       pointHoverBorderColor: getStyle('--cui-info'),
//       data: [1, 18, 9, 17, 34, 22, 11]
//     }], [{
//       label: 'My Third dataset',
//       backgroundColor: 'rgba(255,255,255,.2)',
//       borderColor: 'rgba(255,255,255,.55)',
//       pointBackgroundColor: getStyle('--cui-warning'),
//       pointHoverBorderColor: getStyle('--cui-warning'),
//       data: [78, 81, 80, 45, 34, 12, 40],
//       fill: true
//     }], [{
//       label: 'My Fourth dataset',
//       backgroundColor: 'rgba(255,255,255,.2)',
//       borderColor: 'rgba(255,255,255,.55)',
//       data: [78, 81, 80, 45, 34, 12, 40, 85, 65, 23, 12, 98, 34, 84, 67, 82],
//       barPercentage: 0.7
//     }]
//   ];
//   optionsDefault = {
//     plugins: {
//       legend: {
//         display: false
//       }
//     },
//     maintainAspectRatio: false,
//     scales: {
//       x: {
//         border: {
//           display: false,
//         },
//         grid: {
//           display: false,
//           drawBorder: false
//         },
//         ticks: {
//           display: false
//         }
//       },
//       y: {
//         min: 30,
//         max: 89,
//         display: false,
//         grid: {
//           display: false
//         },
//         ticks: {
//           display: false
//         }
//       }
//     },
//     elements: {
//       line: {
//         borderWidth: 1,
//         tension: 0.4
//       },
//       point: {
//         radius: 4,
//         hitRadius: 10,
//         hoverRadius: 4
//       }
//     }
//   };

//   //  new data 
//   ngOnInit(): void {
//     this.fetchTotalUsers();
//     this.fetchTotalStaff()
//     this.fetchTotalCategory()
//     this.fetchTotalBrand()
//     this.fetchTotalVehicle()
//     this.fetchTotalEnquiry()
//     this.fetchTotalTransport()
//     this.setData();
//   }

//   ngAfterContentInit(): void {
//     this.changeDetectorRef.detectChanges();

//   }

//   setData() {
//     for (let idx = 0; idx < 4; idx++) {
//       this.data[idx] = {
//         labels: idx < 3 ? this.labels.slice(0, 7) : this.labels,
//         datasets: this.datasets[idx]
//       };
//     }
//     this.setOptions();
//   }

//   setOptions() {
//     for (let idx = 0; idx < 4; idx++) {
//       const options = JSON.parse(JSON.stringify(this.optionsDefault));
//       switch (idx) {
//         case 0: {
//           this.options.push(options);
//           break;
//         }
//         case 1: {
//           options.scales.y.min = -9;
//           options.scales.y.max = 39;
//           options.elements.line.tension = 0;
//           this.options.push(options);
//           break;
//         }
//         case 2: {
//           options.scales.x = { display: false };
//           options.scales.y = { display: false };
//           options.elements.line.borderWidth = 2;
//           options.elements.point.radius = 0;
//           this.options.push(options);
//           break;
//         }
//         case 3: {
//           options.scales.x.grid = { display: false, drawTicks: false };
//           options.scales.x.grid = { display: false, drawTicks: false, drawBorder: false };
//           options.scales.y.min = undefined;
//           options.scales.y.max = undefined;
//           options.elements = {};
//           this.options.push(options);
//           break;
//         }
//       }
//     }
//   }
//   // new data
//   fetchTotalUsers() {
//     this.usersService.getAll().subscribe((users) => {
//       this.totalUsers = users.length;
//     }, (error) => {
//       console.error('Failed to load user count', error);
//     });
//   }
//   fetchTotalStaff() {
//     this.staffService.getAllStaff().subscribe((staff) => {
//       this.totalStaff = staff.length;
//     }, (error) => {
//       console.error('Failed to load staff count', error);
//     });
//   }
//   fetchTotalCategory() {
//     this.vehicleCategoryService.getAll().subscribe((category) => {
//       this.totalCategory = category.length;
//     }, (error) => {
//       console.error('Failed to load category count', error);
//     });
//   }
//   fetchTotalBrand() {
//     this.brandService.getAll().subscribe((brand) => {
//       this.totalBrand = brand.length;
//     }, (error) => {
//       console.error('Failed to load brand count', error);
//     });
//   }
//   fetchTotalVehicle() {
//     this.vehicleService.getAll().subscribe((vehicle) => {
//       this.totalVehicle = vehicle.length;
//     }, (error) => {
//       console.error('Failed to load vehicle count', error);
//     });
//   }
//   fetchTotalEnquiry() {
//     this.vehiclesEnquiryService.getAll().subscribe((enquiry) => {
//       this.totalEnquiry = enquiry.length;
//     }, (error) => {
//       console.error('Failed to load enquiry count', error);
//     });
//   }
//    fetchTotalTransport() {
//     this.transportVehicleService.getAllTransports().subscribe((transport) => {
//       this.totalTransport = transport.length;
//     }, (error) => {
//       console.error('Failed to load transport count', error);
//     });
//   }
// }


// @Component({
//   selector: 'app-chart-sample',
//   template: '<c-chart type="line" [data]="data" [options]="options" width="300" #chart></c-chart>',
//   imports: [ChartjsComponent]
// })
// export class ChartSample implements AfterViewInit {

//   constructor() { }

//   @ViewChild('chart') chartComponent!: ChartjsComponent;

//   colors = {
//     label: 'My dataset',
//     backgroundColor: 'rgba(77,189,116,.2)',
//     borderColor: '#4dbd74',
//     pointHoverBackgroundColor: '#fff'
//   };

//   labels = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];

//   data = {
//     labels: this.labels,
//     datasets: [{
//       data: [65, 59, 84, 84, 51, 55, 40],
//       ...this.colors,
//       fill: { value: 65 }
//     }]
//   };

//   options = {
//     maintainAspectRatio: false,
//     plugins: {
//       legend: {
//         display: false
//       }
//     },
//     elements: {
//       line: {
//         tension: 0.4
//       }
//     }
//   };

//   ngAfterViewInit(): void {
//     setTimeout(() => {
//       const data = () => {
//         return {
//           ...this.data,
//           labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
//           datasets: [{
//             ...this.data.datasets[0],
//             data: [42, 88, 42, 66, 77],
//             fill: { value: 55 }
//           }, { ...this.data.datasets[0], borderColor: '#ffbd47', data: [88, 42, 66, 77, 42] }]
//         };
//       };
//       const newLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May'];
//       const newData = [42, 88, 42, 66, 77];
//       let { datasets, labels } = { ...this.data };
//       // @ts-ignore
//       const before = this.chartComponent?.chart?.data.datasets.length;
//       console.log('before', before);
//       // console.log('datasets, labels', datasets, labels)
//       // @ts-ignore
//       // this.data = data()
//       this.data = {
//         ...this.data,
//         datasets: [{ ...this.data.datasets[0], data: newData }, {
//           ...this.data.datasets[0],
//           borderColor: '#ffbd47',
//           data: [88, 42, 66, 77, 42]
//         }],
//         labels: newLabels
//       };
//       // console.log('datasets, labels', { datasets, labels } = {...this.data})
//       // @ts-ignore
//       setTimeout(() => {
//         const after = this.chartComponent?.chart?.data.datasets.length;
//         console.log('after', after);
//       });
//     }, 5000);
//   }

// }






















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
import { UsersService } from '../../../services/users.service';
import { StaffService } from '../../../services/staff.service';
import { VehicleCategoryService } from '../../../services/vehicle.category.service';
import { BrandService } from '../../../services/brand.service';
import { VehicleService } from '../../../services/vehicle.service';
import { VehiclesEnquiryService } from '../../../services/vehicles.enquiry.service';
import { TransportVehicleService } from '../../../services/transport.vehicle.service';

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