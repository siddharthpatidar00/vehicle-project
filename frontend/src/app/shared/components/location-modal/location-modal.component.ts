import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; 

@Component({
  selector: 'app-location-modal',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule   
  ],
  templateUrl: './location-modal.component.html',
  styleUrls: ['./location-modal.component.css']
})
export class LocationModalComponent {
  isOpen = false;
  country = '';
  city = '';

  open() {
    this.isOpen = true;
  }

  closeLocation() {
  this.isOpen = false;
}

  saveLocation() {
    localStorage.setItem('locationModalShown', 'true');
    localStorage.setItem('userCountry', this.country);
    localStorage.setItem('userCity', this.city);
    this.isOpen = false;
  }
}
