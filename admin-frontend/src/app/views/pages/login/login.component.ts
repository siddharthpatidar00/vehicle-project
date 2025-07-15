import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgStyle } from '@angular/common';
import { IconDirective } from '@coreui/icons-angular';
import { ContainerComponent, RowComponent, ColComponent, CardGroupComponent, TextColorDirective, CardComponent, CardBodyComponent, FormDirective, InputGroupComponent, InputGroupTextDirective, FormControlDirective, ButtonDirective } from '@coreui/angular';
import { Router } from '@angular/router';
import {AdminService} from '../../../services/admin.service'
import {AuthService} from '../../../services/auth.service'
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ToastService } from '../../../services/toast.service';


@Component({
    selector: 'app-login',
    standalone: true,
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    imports: [ContainerComponent, RowComponent, ColComponent, CardGroupComponent, TextColorDirective, CardComponent, CardBodyComponent, FormDirective, InputGroupComponent, InputGroupTextDirective, IconDirective, FormControlDirective, ButtonDirective, NgStyle,CommonModule, FormsModule, HttpClientModule]
})

export class LoginComponent {

  email = '';
  password = '';

  constructor(
    private adminService: AdminService,
    private authService: AuthService,
    private router: Router,
    private toast:ToastService
  ) {}

onLogin() {
  this.adminService.login(this.email, this.password).subscribe({
    next: (response) => {
      this.authService.setToken(response.token);
      this.toast.success('Login successful', 'Success');
      this.router.navigate(['/dashboard']);
    },
    error: (error) => {
      if (error.error?.message === 'Email does not exist') {
        this.toast.error('Email does not exist', 'Error');
      } else {
        this.toast.error('Invalid credentials', 'Error');
      }
    }
  });
}

}
