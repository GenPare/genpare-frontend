import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from "@angular/forms";
import { DataManagementService } from 'app/data-management.service';
import { Observable } from 'rxjs';
import { federal_states_s, education_degrees_s, genders_s } from "@shared/model/select_data";
import { ProfileData } from "../../data-management.service";

@Component({
  selector: 'app-data-management',
  templateUrl: './data-management.component.html',
  styleUrls: ['./data-management.component.scss']
})

export class DataManagementComponent implements OnInit {

  federal_states: string[]; 
  genders: string[];
  education_degrees: string[];

  data?: ProfileData;

  data_management = new FormGroup({
    job: new FormControl(''),
    education_degree: new FormControl(''),
    federal_state: new FormControl(''),
    salary: new FormControl(''),
    gender: new FormControl(''),
    age: new FormControl('')
  })
  
  constructor(private dataManagementService: DataManagementService) {
    this.federal_states = federal_states_s;
    this.genders = genders_s;
    this.education_degrees = education_degrees_s;
  }

  ngOnInit(): void {
  }

  save(): void {
    this.data = {
      job_title: this.data_management.value.job,
      salary: this.data_management.value.salary,
      education_degree: this.data_management.value.education_degree,
      federal_state: this.data_management.value.federal_state,
      gender: this.data_management.value.gender
    }
    this.dataManagementService.newProfileData(this.data);
  }
}
