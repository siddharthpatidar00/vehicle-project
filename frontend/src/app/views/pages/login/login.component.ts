import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService, LoginPayload } from '../../../shared/services/auth.service';
import { ToastService } from '../../../shared/services/toast.service';
import { LoginSchema } from '../../../shared/schema/login.validation';
import { validateYupSchema } from '../../../shared/schema/yup.validation';
import { DefaultFooterComponent } from '../../../layout/default-layout/default-footer/default-footer.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule,DefaultFooterComponent],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  form = new FormGroup({
    email: new FormControl(''),
    password: new FormControl('')
  }, { validators: validateYupSchema(LoginSchema) });

  constructor(
    private authService: AuthService,
    private router: Router,
    private toast: ToastService
  ) {}

  login(): void {
    this.form.markAllAsTouched();
    if (this.form.invalid) return;

    const payload: LoginPayload = {
      email: this.form.value.email || '',
      password: this.form.value.password || ''
    };

    this.authService.login(payload).subscribe({
      next: () => {
        this.toast.success('Success', 'Login successful!');
        this.router.navigate(['/home']);
      },
      error: (err) => {
        const errorMessage = err.error?.message || 'Login failed';
        this.toast.error('Error', errorMessage);
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
