import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { SelectDataService } from "../../select-data.service";
import { DataManagementService, Data } from "../../data-management.service";

@Component({
  selector: 'app-compare',
  templateUrl: './compare.component.html',
  styleUrls: ['./compare.component.scss']
})
export class CompareComponent implements OnInit {

  federal_states$: Observable<String[]>; 
  education_degrees$: Observable<String[]>;
  data$: Observable<Data[]>;

  table_headers: string[] = [
    "Beruf",
    "Ausbildungsgrad",
    "Alter",
    "Bundesland",
    "Geschlecht",
    "Gehalt"
  ]

  constructor(public selectDataService: SelectDataService, private dataManagementService: DataManagementService ) {
    this.federal_states$ = selectDataService.getFederalStates();
    this.education_degrees$ = selectDataService.getEducationDegrees();
    this.data$ = dataManagementService.getData();
  }

  ngOnInit(): void {
  }

  search(): void {
    
  }

}
