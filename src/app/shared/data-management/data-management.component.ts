import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from "@angular/forms";
import { Observable } from 'rxjs';
import { federal_states_s, education_degrees_s, genders_s } from "@shared/model/select_data";

@Component({
  selector: 'app-data-management',
  templateUrl: './data-management.component.html',
  styleUrls: ['./data-management.component.scss']
})

export class DataManagementComponent implements OnInit {

  federal_states: string[]; 

  genders: string[];

  education_degrees: string[];

  data_management = new FormGroup({
    job: new FormControl(''),
    education_degree: new FormControl(''),
    federal_state: new FormControl(''),
    salary: new FormControl(''),
    gender: new FormControl(''),
    age: new FormControl('')
  })
  
  constructor() {
    this.federal_states = federal_states_s;
    this.genders = genders_s;
    this.education_degrees = education_degrees_s;
  }

  ngOnInit(): void {
  }

  save(): void {
    
  }
}
