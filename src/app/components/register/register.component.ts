import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, ValidationErrors, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {

  registerForm = this.fb.group( {
    email1: ['',[Validators.email, Validators.required]],
    email2: ['',[Validators.email, Validators.required]],
    password1: ['',[Validators.required, Validators.minLength(6)]],
    password2: ['',[Validators.required, Validators.minLength(6)]],
  },{validator: [this.checkIfMatching('password1', 'password2'),this.checkIfMatching('email1', 'email2')]});

  failedAttempt = false;

  constructor(private router: Router, private fb:FormBuilder) { }

  

  checkIfMatching(formKey1: string, formKey2:string) {
    return (group: AbstractControl):  ValidationErrors | null => { 
      let value = group.get(formKey1)?.value;
      let confirmValue = group.get(formKey2)?.value;
      return value === confirmValue ? null : { notSame: true }
    }
  }

  register() {
    if (!this.registerForm.valid) {
      this.failedAttempt = true;
      this.registerForm.controls["password1"].reset();
      this.registerForm.controls["password2"].reset();
    } else {
      this.router.navigate(['profile']);
    }
  }

}
