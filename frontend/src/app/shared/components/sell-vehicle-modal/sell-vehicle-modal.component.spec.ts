import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SellVehicleModalComponent } from './sell-vehicle-modal.component';

describe('SellVehicleModalComponent', () => {
  let component: SellVehicleModalComponent;
  let fixture: ComponentFixture<SellVehicleModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SellVehicleModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SellVehicleModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
