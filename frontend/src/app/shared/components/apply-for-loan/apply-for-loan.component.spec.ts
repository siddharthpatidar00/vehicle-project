import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplyForLoanComponent } from './apply-for-loan.component';

describe('ApplyForLoanComponent', () => {
  let component: ApplyForLoanComponent;
  let fixture: ComponentFixture<ApplyForLoanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ApplyForLoanComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApplyForLoanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
