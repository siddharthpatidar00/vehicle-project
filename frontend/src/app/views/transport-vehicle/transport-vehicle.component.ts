import { Component,EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { TransportVehicleService } from '../../shared/services/transport-vehicle.service';
import { validateYupSchema } from '../../shared/schema/yup.validation';
import { TransportVehicleSchema } from '../../shared/schema/transport.vehicle.schema';
import { ToastService } from '../../shared/services/toast.service';

@Component({
  selector: 'app-transport-vehicle',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  templateUrl: './transport-vehicle.component.html',
  styleUrls: ['./transport-vehicle.component.scss']
})
export class TransportVehicleComponent {
  @Output() close = new EventEmitter<void>();
  form = new FormGroup({
    name: new FormControl(''),
    pickup_location: new FormControl(''),
    drop_location: new FormControl(''),
    phone_number: new FormControl(''),
    vehicle_detail: new FormControl(''),
    shifting_date: new FormControl(''),
    status: new FormControl('Pending')
  }, { validators: validateYupSchema(TransportVehicleSchema) });

  constructor(private transportService: TransportVehicleService, private toast: ToastService) { }

  submitTransport() {
    this.form.markAllAsTouched();
    if (this.form.invalid) {
      return;
    }

    const payload = this.form.value;
    this.transportService.createTransport(payload).subscribe({
      next: () => {
        this.toast.success('Success', 'Transport request submitted!');
        this.form.reset({ status: 'Pending' });
      },
      error: (err) => {
        this.toast.error('Error', 'Failed to submit');
      }
    });
  }

  hasError(field: string): boolean {
    const control = this.form.get(field);
    return !!(control && control.invalid && control.touched);
  }

  getError(field: string): string | null {
    return this.form.get(field)?.getError('yup') || null;
  }

  closeModal() {
    this.close.emit()
  }
}
