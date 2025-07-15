import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuyVehiclesComponent } from './buy-vehicles.component';

describe('BuyVehiclesComponent', () => {
  let component: BuyVehiclesComponent;
  let fixture: ComponentFixture<BuyVehiclesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BuyVehiclesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BuyVehiclesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
