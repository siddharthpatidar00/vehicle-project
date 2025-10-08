import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgStyle } from '@angular/common';
import { IconDirective } from '@coreui/icons-angular';
import {
  ContainerComponent,
  RowComponent,
  ColComponent,
  CardGroupComponent,
  TextColorDirective,
  CardComponent,
  CardBodyComponent,
  FormDirective,
  InputGroupComponent,
  InputGroupTextDirective,
  FormControlDirective,
  ButtonDirective
} from '@coreui/angular';
import { Router } from '@angular/router';
import { AdminService } from '../../../../services/admin.service';
import { AdminAuthService } from '../../../../services/auth.service';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ToastService } from '../../../../services/toast.service';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  imports: [
    ContainerComponent,
    RowComponent,
    ColComponent,
    CardGroupComponent,
    TextColorDirective,
    CardComponent,
    CardBodyComponent,
    FormDirective,
    InputGroupComponent,
    InputGroupTextDirective,
    IconDirective,
    FormControlDirective,
    ButtonDirective,
    NgStyle,
    CommonModule,
    FormsModule,
    HttpClientModule
  ]
})
export class LoginComponent {

  email = '';
  password = '';

  constructor(
    private adminService: AdminService,
    private authService: AdminAuthService,
    private router: Router,
    private toast: ToastService
  ) {}

  onLogin() {
    if (!this.email || !this.password) {
      this.toast.error('Email and Password are required');
      return;
    }

    this.adminService.login(this.email, this.password).subscribe({
      next: (response) => {
        if (!response || !response.token) {
          this.toast.error('Login failed: No token received');
          return;
        }

        // Save token
        this.authService.setToken(response.token);

        // Show success message
        this.toast.success('Login Successfully');

        // Redirect both Admin and Staff to same dashboard
        this.router.navigate(['/admin-dashboard']);
      },
      error: (error) => {
        const message = error.error?.message || 'Invalid Credentials';
        this.toast.error(message);
      }
    });
  }
}
