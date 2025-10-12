// src/app/views/User/transport-vehicle/transport-vehicle.component.ts

import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { TransportVehicleService, TransportVehicle, TransportStatus } from '../../../services/transport.vehicle.service';
import { validateYupSchema } from '../../../schema/yup-validator';
import { TransportVehicleSchema } from '../../../schema/transport.vehicle.schema';
import { ToastService } from '../../../services/toast.service';


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

  constructor(
    private transportService: TransportVehicleService,
    private toast: ToastService
  ) { }

  // Submit transport request
  submitTransport() {
    this.form.markAllAsTouched();
    if (this.form.invalid) {
      return;
    }

    // Convert undefined → null for backend compatibility
    const payload: TransportVehicle = {
      name: this.form.value.name ?? null,
      pickup_location: this.form.value.pickup_location ?? null,
      drop_location: this.form.value.drop_location ?? null,
      phone_number: this.form.value.phone_number ?? null,
      vehicle_detail: this.form.value.vehicle_detail ?? null,
      shifting_date: this.form.value.shifting_date ?? null,
      status: (this.form.value.status as TransportStatus) ?? 'Pending'

    };

    this.transportService.createTransport(payload).subscribe({
      next: () => {
        this.toast.success('Transport request submitted Successfully.');
        this.form.reset({ status: 'Pending' });
        this.closeModal();
      },
      error: () => {
        this.toast.error('Failed to submit Transport Request.');
      }
    });
  }

  // Check if field has validation error
  hasError(field: string): boolean {
    const control = this.form.get(field);
    return !!(control && control.invalid && control.touched);
  }

  // Get field-specific validation error message
  getError(field: string): string | null {
    return this.form.get(field)?.getError('yup') || null;
  }

  // Close the modal popup
  closeModal() {
    this.close.emit();
  }
}
