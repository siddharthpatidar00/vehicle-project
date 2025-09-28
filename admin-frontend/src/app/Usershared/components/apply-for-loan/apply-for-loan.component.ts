import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { LoanInquiryService, PartialLoanInquiry } from '../../services/loan.inquiry.service';
import { LoanInquirySchema } from '../../schema/loan.inquiry.validation';
import { validateYupSchema } from '../../schema/yup.validation';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-apply-for-loan',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  templateUrl: './apply-for-loan.component.html',
  styleUrls: ['./apply-for-loan.component.scss']
})
export class ApplyForLoanComponent {
  @Output() close = new EventEmitter<void>();

  applyForLoanForm = new FormGroup({
    fullName: new FormControl(''),
    email: new FormControl(''),
    mobile: new FormControl(''),
    loanAmount: new FormControl(''),
    tenure: new FormControl(''),
    annualIncome: new FormControl(''),
    vehicleDetail: new FormControl('')
  }, { validators: validateYupSchema(LoanInquirySchema) });

  constructor(
    private loanService: LoanInquiryService,
    private toast: ToastService
  ) {}

  submitForm() {
    this.applyForLoanForm.markAllAsTouched();

    if (this.applyForLoanForm.invalid) return;

    const payload: PartialLoanInquiry = this.applyForLoanForm.value as PartialLoanInquiry;

    this.loanService.createLoanInquiry(payload).subscribe({
      next: () => {
        this.toast.success('Success', 'Loan Inquiry Submitted Successfully');
        this.applyForLoanForm.reset();
        this.closeModal();
      },
      error: () => {
        this.toast.error('Error', 'Failed to submit loan inquiry');
      }
    });
  }

  hasError(field: string): boolean {
    const control = this.applyForLoanForm.get(field);
    return !!(control && control.invalid && control.touched);
  }

  getError(field: string): string | null {
    return this.applyForLoanForm.get(field)?.getError('yup') || null;
  }

  closeModal() {
    this.close.emit();
  }
}
