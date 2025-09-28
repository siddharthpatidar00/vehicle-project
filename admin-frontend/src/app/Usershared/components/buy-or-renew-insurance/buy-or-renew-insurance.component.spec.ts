import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuyOrRenewInsuranceComponent } from './buy-or-renew-insurance.component';

describe('BuyOrRenewInsuranceComponent', () => {
  let component: BuyOrRenewInsuranceComponent;
  let fixture: ComponentFixture<BuyOrRenewInsuranceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BuyOrRenewInsuranceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BuyOrRenewInsuranceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
