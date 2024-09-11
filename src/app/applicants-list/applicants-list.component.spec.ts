import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplicantsListComponent } from './applicants-list.component';

describe('ApplicantsListComponent', () => {
  let component: ApplicantsListComponent;
  let fixture: ComponentFixture<ApplicantsListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ApplicantsListComponent],
    });
    fixture = TestBed.createComponent(ApplicantsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
