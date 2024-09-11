import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobActivateComponent } from './job-activate.component';

describe('JobActivateComponent', () => {
  let component: JobActivateComponent;
  let fixture: ComponentFixture<JobActivateComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [JobActivateComponent],
    });
    fixture = TestBed.createComponent(JobActivateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
