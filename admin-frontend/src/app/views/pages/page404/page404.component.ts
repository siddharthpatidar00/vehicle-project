import { Component } from '@angular/core';
import { ContainerComponent, RowComponent, ColComponent } from '@coreui/angular';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-page404',
    templateUrl: './page404.component.html',
    styleUrls: ['./page404.component.scss'],
    imports: [ContainerComponent, RowComponent, ColComponent,RouterLink]
})
export class Page404Component {

  constructor() { }

}
