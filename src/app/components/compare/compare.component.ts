import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { SelectDataService } from "../../select-data.service";
import { DataManagementService, CompareData } from "../../data-management.service";

@Component({
  selector: 'app-compare',
  templateUrl: './compare.component.html',
  styleUrls: ['./compare.component.scss']
})
export class CompareComponent implements OnInit {

  federal_states$: Observable<String[]>; 
  education_degrees$: Observable<String[]>;
  data$: Observable<CompareData[]>;

  table_headers: string[] = [
    "Beruf",
    "Ausbildungsgrad",
    "Bundesland",
    "Geschlecht",
    "Gehalt"
  ]

  constructor(public selectDataService: SelectDataService, private dataManagementService: DataManagementService ) {
    this.federal_states$ = selectDataService.getFederalStates();
    this.education_degrees$ = selectDataService.getEducationDegrees();
    this.data$ = dataManagementService.getCompareData();
  }

  ngOnInit(): void {
  }

  search(): void {
    
  }

}
