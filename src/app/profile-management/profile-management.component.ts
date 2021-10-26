import { Component, OnInit } from '@angular/core';
import { DataManagementComponent } from "@shared/data-management/data-management.component";

@Component({
  selector: 'app-profile-management',
  templateUrl: './profile-management.component.html',
  styleUrls: ['./profile-management.component.scss']
})
export class ProfileManagementComponent implements OnInit {

  email: String = "email@email.email"
  password: String = "********";
  nickname: String = "nickname1";
  account_created: Date = new Date();

  constructor() { }

  ngOnInit(): void {
  }

}
