import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplicantsComponent } from './applicants.component';

describe('ApplicantsComponent', () => {
  let component: ApplicantsComponent;
  let fixture: ComponentFixture<ApplicantsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ApplicantsComponent],
    });
    fixture = TestBed.createComponent(ApplicantsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
