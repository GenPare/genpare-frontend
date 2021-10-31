import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from "@angular/forms";
import { Observable } from 'rxjs';
import { SelectDataService } from "../../select-data.service";

@Component({
  selector: 'app-data-management',
  templateUrl: './data-management.component.html',
  styleUrls: ['./data-management.component.scss']
})

export class DataManagementComponent implements OnInit {

  federal_states$: Observable<String[]>; 

  genders$: Observable<String[]>;

  education_degrees$: Observable<String[]>;

  data_management = new FormGroup({
    job: new FormControl(''),
    education_degree: new FormControl(''),
    federal_state: new FormControl(''),
    salary: new FormControl(''),
    gender: new FormControl(''),
    age: new FormControl('')
  })
  
  constructor(public selectDataService: SelectDataService) {
    this.federal_states$ = selectDataService.getFederalStates();
    this.genders$ = selectDataService.getGenders();
    this.education_degrees$ = selectDataService.getEducationDegrees();
  }

  ngOnInit(): void {
  }

  save(): void {
    
  }
}
