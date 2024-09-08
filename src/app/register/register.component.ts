import { Component } from '@angular/core';
import { FormBuilder, Validators, FormControl, FormGroupDirective, NgForm } from '@angular/forms';

import { ErrorStateMatcher } from '@angular/material/core';
import { MatTabChangeEvent } from '@angular/material/tabs';

/** Error when invalid control is dirty, touched, or submitted. */
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && isSubmitted && (control.dirty || control.touched || isSubmitted));
  }
}
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent {
  registerForm = this.fb.group({
    username: ['', Validators.required],
    email: ['', Validators.required],
    password: ['', Validators.required],
    firstName: [''],
    lastName: [''],
    roles: this.fb.control<string[]>(['USER']), // Initialize as string array
  });

  matcher = new MyErrorStateMatcher();

  constructor(private fb: FormBuilder) {}

  onSubmit(): void {
    console.log('submitted form', this.registerForm.value);
  }

  onTabChange(event: MatTabChangeEvent): void {
    if (event.index === 0) {
      // User tab
      this.registerForm.patchValue({ roles: ['USER'] });
    } else if (event.index === 1) {
      // Organization tab
      this.registerForm.patchValue({ roles: ['ORGANIZATION'] });
    }
  }
}
