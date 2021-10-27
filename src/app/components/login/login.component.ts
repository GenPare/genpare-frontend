import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginForm = new FormGroup( {
    email: new FormControl('',[Validators.email, Validators.required]),
    password: new FormControl('',Validators.required)
  })

  failedLogIn = false;

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  login(): void {
    if (!this.loginForm.valid) {
      this.failedLogIn = true;
      this.loginForm.controls["password"].reset();
    } else {
      this.router.navigate(['profile']);
    }
  }

}
