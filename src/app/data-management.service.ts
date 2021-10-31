import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient } from "@angular/common/http";

export interface Data {
  job_title: string;
  age: Range;
  salary: Range;
  education_degree: string;
  federal_state: string;
  gender: string;
}

interface Range {
  min: number;
  max: number;
}

@Injectable({
  providedIn: 'root'
})
export class DataManagementService {

  constructor(private http: HttpClient) { }

  getData(): Observable<Data[]> {
    return of([
      {
        job_title: "Polizist",
        age: {
          min: 40,
          max: 44
        },
        salary: {
          min: 4000,
          max: 4500
        },
        education_degree: "Ausbildung",
        federal_state: "Brandenburg",
        gender: "weiblich"
      },
      {
        job_title: "Krankenpfleger",
        age: {
          min: 50,
          max: 54
        },
        salary: {
          min: 2500,
          max: 3000
        },
        education_degree: "Abitur",
        federal_state: "Berlin",
        gender: "männlich"
      },
      {
        job_title: "Anwalt",
        age: {
          min: 30,
          max: 34
        },
        salary: {
          min: 5500,
          max: 6000
        },
        education_degree: "Master",
        federal_state: "Hessen",
        gender: "divers"
      }
    ]);
  }
}
