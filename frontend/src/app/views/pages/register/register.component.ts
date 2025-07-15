import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService, RegisterPayload } from '../../../shared/services/auth.service';
import { validateYupSchema } from '../../../shared/schema/yup.validation';
import { RegisterSchema } from '../../../shared/schema/register.validation';
import { ToastService } from '../../../shared/services/toast.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  captchaText = '';

  form = new FormGroup({
    first_name: new FormControl(''),
    last_name: new FormControl(''),
    gender: new FormControl(''),
    email: new FormControl(''),
    password: new FormControl(''),
    mobile: new FormControl(''),
    company: new FormControl(''),
    gst: new FormControl(''),
    pan: new FormControl(''),
    dob: new FormControl(''),
    aadhar: new FormControl(''),
    city: new FormControl(''),
    address: new FormControl(''),
    captcha: new FormControl(''),
    sessionCaptcha: new FormControl(''),
    status: new FormControl('Active')
  }, { validators: validateYupSchema(RegisterSchema) });

  constructor(private authService: AuthService, private router: Router, private toast: ToastService) { }

  ngOnInit(): void {
    this.generateCaptcha();
  }

  generateCaptcha(): void {
    const text = Math.random().toString(36).substring(2, 8).toUpperCase();
    this.captchaText = text;
    this.form.patchValue({ sessionCaptcha: text });
  }

  register(): void {
    this.form.markAllAsTouched();
    if (this.form.invalid) return;

    const { captcha, sessionCaptcha, ...rest } = this.form.value;

    if (captcha !== sessionCaptcha) {
      this.toast.error('error','Captcha does not match');
      this.generateCaptcha();
      return;
    }

    this.authService.register(rest as RegisterPayload).subscribe({
      next: () => {
        this.toast.success('success','Registration successful!');
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.toast.error('error',err.error?.message || 'Registration failed');
        this.generateCaptcha();
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
}
