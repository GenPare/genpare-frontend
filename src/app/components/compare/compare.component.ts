import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { SelectDataService } from "../../select-data.service";
import { DataManagementService } from "../../data-management.service";

@Component({
  selector: 'app-compare',
  templateUrl: './compare.component.html',
  styleUrls: ['./compare.component.scss']
})
export class CompareComponent implements OnInit {

  federal_states$: Observable<String[]>; 

  education_degrees$: Observable<String[]>;

  constructor(public selectDataService: SelectDataService, private dataService: DataManagementService ) {
    this.federal_states$ = selectDataService.getFederalStates();
    this.education_degrees$ = selectDataService.getEducationDegrees();
  }

  ngOnInit(): void {
  }

  search(): void {
    
  }

}
