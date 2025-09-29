import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VehiclesEnquiryComponent } from './vehicles-enquiry.component';

describe('VehiclesEnquiryComponent', () => {
  let component: VehiclesEnquiryComponent;
  let fixture: ComponentFixture<VehiclesEnquiryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VehiclesEnquiryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VehiclesEnquiryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
