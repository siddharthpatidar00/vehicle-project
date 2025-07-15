import { Component, ViewChild, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {
  ShadowOnScrollDirective
} from '@coreui/angular';

import { DefaultFooterComponent, DefaultHeaderComponent } from './';
import { navItems } from './_nav';
import { LocationModalComponent } from '../../shared/components/location-modal/location-modal.component';
import { LocationService } from '../../shared/services/location.service';


@Component({
  selector: 'app-home',
  templateUrl: './default-layout.component.html',
  styleUrls: ['./default-layout.component.scss'],
  imports: [
    DefaultFooterComponent,
    DefaultHeaderComponent,
    RouterOutlet,
    ShadowOnScrollDirective,
    LocationModalComponent
  ]
})
export class DefaultLayoutComponent implements OnInit {
  public navItems = [...navItems];

  @ViewChild('locationModal') locationModal!: LocationModalComponent;

  constructor(private locationService: LocationService) { }

  ngOnInit(): void {
    const shown = localStorage.getItem('locationModalShown');
    if (!shown) {
      setTimeout(() => this.locationModal.open(), 100);
    }

    this.locationService.openModal$.subscribe(() => {
      this.locationModal.open();
    });
  }
}
