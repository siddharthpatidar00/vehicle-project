import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService, User } from '../../services/auth.service';
import { ToastService } from '../../../shared/services/toast.service';

@Component({
  selector: 'app-profile-modal',
  imports: [CommonModule, FormsModule],
  templateUrl: './profile-modal.component.html',
  standalone: true,
})
export class ProfileModalComponent implements OnInit {
  @Output() close = new EventEmitter<void>();
  selectedTab: string = 'editProfile';

  user: User | null = null;
  currentPassword: string = '';
  newPassword: string = '';
  confirmPassword: string = '';

  // editable copy for form
  editUser: {
    id?: string;
    email?: string;
    first_name?: string;
    last_name?: string;
    address?: string;
    nickname?: string;
    dob?: string; // formatted YYYY-MM-DD for <input type="date">
  } = {};

  constructor(private authService: AuthService, private toast: ToastService) { }

  ngOnInit() {
    const storedUser = this.authService.getUser();
    // console.log("Stored User:", storedUser); // 👈 debug

    const uid = storedUser?.id || storedUser?._id; // ✅ fallback to _id

    if (uid) {
      this.authService.getProfile(uid).subscribe({
        next: (freshUser) => {
          this.user = freshUser;
          this.mapUserToEditUser(freshUser);
        },
        error: (err) => {
          this.toast.error("Error loading profile:", err);
        }
      });
    }
  }



  private loadUserData() {
    this.user = this.authService.getUser();
    if (this.user) {
      this.mapUserToEditUser(this.user);
    }
  }

  // Map User -> editUser (dob formatted)
  private mapUserToEditUser(user: User) {
    this.editUser = {
      id: user.id || user._id,
      email: user.email,
      first_name: user.first_name || '',
      last_name: user.last_name || '',
      address: user.address || '',
      nickname: user.nickname || '',
      dob: user.dob ? new Date(user.dob).toISOString().split('T')[0] : ''
    };
  }

  onClose() {
    this.close.emit();
  }

  setTab(tab: string) {
    this.selectedTab = tab;
  }

  saveProfile() {
    if (!this.editUser.id) {
      this.toast.error('error', "User ID is missing!");
      return;
    }

    const payload: Partial<User> = {
      first_name: this.editUser.first_name,
      last_name: this.editUser.last_name,
      address: this.editUser.address,
      nickname: this.editUser.nickname,
      dob: this.editUser.dob ? new Date(this.editUser.dob) : undefined
    };

    this.authService.updateProfile(this.editUser.id, payload).subscribe({
      next: (res) => {
        this.user = res.user;
        this.mapUserToEditUser(this.user!);

        // 👇 persist updated user in AuthService/localStorage
        this.authService.setUser(res.user);

        this.toast.success('success', 'Profile updated successfully');
      },
      error: (err) => {
        console.error(err);
        this.toast.warn('warn', 'Error updating profile');
      },
    });
  }


  changePassword() {
    if (!this.currentPassword || !this.newPassword || !this.confirmPassword) {
      this.toast.warn('warn', 'All fields are required');
      return;
    }

    if (this.newPassword !== this.confirmPassword) {
      this.toast.error('error', 'New passwords do not match');
      return;
    }

    this.authService.changePassword(this.currentPassword, this.newPassword).subscribe({
      next: (res) => {
        this.toast.success('success', res.message || 'Password changed successfully');
        this.currentPassword = '';
        this.newPassword = '';
        this.confirmPassword = '';
      },
      error: (err) => {
        console.error(err);
        this.toast.error('error', err.error?.message || 'Error changing password');
      }
    });
  }
}
