import { Component } from '@angular/core';
import { FormBuilder, Validators, FormControl, FormGroupDirective, NgForm } from '@angular/forms';

import { ErrorStateMatcher } from '@angular/material/core';

/** Error when invalid control is dirty, touched, or submitted. */
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && isSubmitted && (control.dirty || control.touched));
  }
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  loginForm = this.fb.group({
    username: ['', Validators.required],
    password: ['', Validators.required],
  });

  matcher = new MyErrorStateMatcher();

  constructor(private fb: FormBuilder) {}

  onSubmit(): void {
    console.log('submitted form', this.loginForm.value);
  }
}
