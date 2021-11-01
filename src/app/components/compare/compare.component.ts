import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { DataManagementService, Data } from "../../data-management.service";
import { education_degrees, federal_states } from "@shared/model/select_data";

@Component({
  selector: 'app-compare',
  templateUrl: './compare.component.html',
  styleUrls: ['./compare.component.scss']
})
export class CompareComponent implements OnInit {

  federal_states: string[]; 
  education_degrees: string[];
  data$: Observable<Data[]>;

  table_headers: string[] = [
    "Beruf",
    "Ausbildungsgrad",
    "Alter",
    "Bundesland",
    "Geschlecht",
    "Gehalt"
  ]

  constructor(private dataManagementService: DataManagementService ) {
    this.federal_states = federal_states;
    this.education_degrees = education_degrees;
    this.data$ = dataManagementService.getData();
  }

  ngOnInit(): void {
  }

  search(): void {
    
  }

}
