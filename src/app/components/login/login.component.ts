import { Component, OnInit } from '@angular/core';
import { EmailValidator, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginForm = new FormGroup( {
    email: new FormControl('',[Validators.email, Validators.required]),
    password: new FormControl('')
  })

  constructor() { }

  ngOnInit(): void {
  }

  login(): void {
    console.log(this.loginForm.valid)
  }

}
