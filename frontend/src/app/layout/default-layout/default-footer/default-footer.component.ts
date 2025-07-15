import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FooterComponent, FooterModule } from '@coreui/angular';

@Component({
    selector: 'app-default-footer',
    imports: [
    FooterModule,
    RouterModule
  ],
    templateUrl: './default-footer.component.html',
    styleUrls: ['./default-footer.component.scss']
})
export class DefaultFooterComponent extends FooterComponent {
  constructor() {
    super();
  }
}
