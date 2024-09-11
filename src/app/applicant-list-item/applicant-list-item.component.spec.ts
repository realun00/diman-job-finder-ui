import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplicantListItemComponent } from './applicant-list-item.component';

describe('ApplicantListItemComponent', () => {
  let component: ApplicantListItemComponent;
  let fixture: ComponentFixture<ApplicantListItemComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ApplicantListItemComponent],
    });
    fixture = TestBed.createComponent(ApplicantListItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
