import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from "@angular/forms";
import { DataManagementService } from 'app/data-management.service';
import { Observable } from 'rxjs';
import { SelectDataService } from "../../select-data.service";
import { ProfileData } from "../../data-management.service";

@Component({
  selector: 'app-data-management',
  templateUrl: './data-management.component.html',
  styleUrls: ['./data-management.component.scss']
})

export class DataManagementComponent implements OnInit {

  federal_states$: Observable<String[]>; 
  genders$: Observable<String[]>;
  education_degrees$: Observable<String[]>;

  data?: ProfileData;

  data_management = new FormGroup({
    job: new FormControl(''),
    education_degree: new FormControl(''),
    federal_state: new FormControl(''),
    salary: new FormControl(''),
    gender: new FormControl(''),
    age: new FormControl('')
  })
  
  constructor(public selectDataService: SelectDataService, private dataManagementService: DataManagementService) {
    this.federal_states$ = selectDataService.getFederalStates();
    this.genders$ = selectDataService.getGenders();
    this.education_degrees$ = selectDataService.getEducationDegrees();
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
