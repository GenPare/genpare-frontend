import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { DataManagementService, CompareData } from "../../data-management.service";
import { education_degrees_s, federal_states_s } from "@shared/model/select_data";

@Component({
  selector: 'app-compare',
  templateUrl: './compare.component.html',
  styleUrls: ['./compare.component.scss']
})
export class CompareComponent implements OnInit {

  federal_states: string[]; 
  education_degrees: string[];
  data$: Observable<CompareData[]>;

  table_headers: string[] = [
    "Beruf",
    "Ausbildungsgrad",
    "Alter",
    "Bundesland",
    "Geschlecht",
    "Gehalt"
  ]

  constructor(private dataManagementService: DataManagementService ) {
    this.federal_states = federal_states_s;
    this.education_degrees = education_degrees_s;
    this.data$ = dataManagementService.getCompareData();
  }

  ngOnInit(): void {
  }

  search(): void {
    
  }

}
