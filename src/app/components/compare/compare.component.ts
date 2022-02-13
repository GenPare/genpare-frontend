import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import {
  JobInformationService,
  CompareData,
} from '../../services/job-information.service';
import {
  education_degrees_f,
  federal_states_f,
} from '@shared/model/frontend_data';

@Component({
  selector: 'app-compare',
  templateUrl: './compare.component.html',
  styleUrls: ['./compare.component.scss'],
})
export class CompareComponent implements OnInit {
  federal_states: string[];
  education_degrees: string[];
  data$: Observable<CompareData[]>;

  table_headers: string[] = [
    'Beruf',
    'Ausbildungsgrad',
    'Alter',
    'Bundesland',
    'Gehalt',
    'Geschlecht',
  ];

  constructor(private dataManagementService: JobInformationService) {
    this.federal_states = federal_states_f;
    this.education_degrees = education_degrees_f;
    this.data$ = dataManagementService.getCompareData();
  }

  ngOnInit(): void {}

  search(): void {}
}
