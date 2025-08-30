import { Component, EventEmitter, Output } from '@angular/core';
import { FormGroup, ReactiveFormsModule, FormControl } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { InsuranceService, PartialInsurance } from '../../services/insurance.service';
import { InsuranceSchema } from '../../schema/insurance.validation';
import { validateYupSchema } from '../../schema/yup.validation'
import { CommonModule } from '@angular/common';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-buy-or-renew-insurance',
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './buy-or-renew-insurance.component.html',
  styleUrl: './buy-or-renew-insurance.component.scss'
})
export class BuyOrRenewInsuranceComponent {

  @Output() close = new EventEmitter<void>();

  buyRenewInsuranceForm = new FormGroup({
    fullName: new FormControl(''),
    mobile: new FormControl(''),
    policyNumber: new FormControl(''),
    insuranceType: new FormControl(''),
    vehicleDetail: new FormControl('')
  }, { validators: validateYupSchema(InsuranceSchema) });

  constructor(private toast: ToastService, private insuranceService: InsuranceService) { }

  submitForm() {
    this.buyRenewInsuranceForm.markAllAsTouched();

    if(this.buyRenewInsuranceForm.invalid) return;

    const payload: PartialInsurance = this.buyRenewInsuranceForm.value as PartialInsurance

    this.insuranceService.createInsurance(payload).subscribe({
      next: () => {
        this.toast.success('Success','Insurance Inquiry Submitted Successfully')
        this.buyRenewInsuranceForm.reset()
        this.closeModal()
      },
      error: () => {
        this.toast.error('Error', 'Failed to submit insurance form')
      }
    })
  }

  hasError(field: string): boolean {
    const control = this.buyRenewInsuranceForm.get(field);
    return !!(control && control.invalid && control.touched);
  }

  getError(field: string): string | null {
    return this.buyRenewInsuranceForm.get(field)?.getError('yup') || null;
  }


  closeModal() {
    this.close.emit();
  }
}
