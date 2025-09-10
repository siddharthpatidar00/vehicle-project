import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ContactService, Contact } from '../../shared/services/contact.service';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ContactUsSchema } from '../../shared/schema/contact-us.validation';

@Component({
  selector: 'app-contact-us',
  standalone: true,
  imports: [RouterModule, ReactiveFormsModule, CommonModule],
  templateUrl: './contact-us.component.html',
  styleUrls: ['./contact-us.component.scss']
})
export class ContactUsComponent {
  contactForm: FormGroup;
  formErrors: Record<string, string> = {};
  submitted = false;

  constructor(private fb: FormBuilder, private contactService: ContactService) {
    this.contactForm = this.fb.group({
      firstName: [''],
      lastName: [''],
      mobile: [''],
      email: [''],
      message: ['']
    });
  }

  submitForm() {
    this.submitted = true;
    this.formErrors = {};

    ContactUsSchema.validate(this.contactForm.value, { abortEarly: false })
      .then(() => {
        // Validation passed
        const contact: Contact = this.contactForm.value;

        this.contactService.submitContact(contact).subscribe({
          next: () => {
            this.contactForm.reset();
            this.submitted = false;
          },
          error: () => {
            this.contactForm.reset();
            this.submitted = false;
          }
        });
      })
      .catch(err => {
        if (err.inner && Array.isArray(err.inner)) {
          for (const validationError of err.inner) {
            this.formErrors[validationError.path] = validationError.message;
            this.contactForm.get(validationError.path)?.setErrors({ message: validationError.message });
          }
        }
      });
  }
  getError(field: string) {
    const ctl = this.contactForm.get(field);
    return ctl?.errors?.['message'] || null;
  }
}
