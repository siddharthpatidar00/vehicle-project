import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HappyCustomerComponent } from './happy-customer.component';

describe('HappyCustomerComponent', () => {
  let component: HappyCustomerComponent;
  let fixture: ComponentFixture<HappyCustomerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HappyCustomerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HappyCustomerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
