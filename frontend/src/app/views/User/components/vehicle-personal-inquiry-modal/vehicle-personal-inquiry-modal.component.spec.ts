import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VehiclePersonalInquiryModalComponent } from './vehicle-personal-inquiry-modal.component';

describe('VehiclePersonalInquiryModalComponent', () => {
  let component: VehiclePersonalInquiryModalComponent;
  let fixture: ComponentFixture<VehiclePersonalInquiryModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VehiclePersonalInquiryModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VehiclePersonalInquiryModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
