import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplicantItemComponent } from './applicant-item.component';

describe('ApplicantItemComponent', () => {
  let component: ApplicantItemComponent;
  let fixture: ComponentFixture<ApplicantItemComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ApplicantItemComponent],
    });
    fixture = TestBed.createComponent(ApplicantItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
