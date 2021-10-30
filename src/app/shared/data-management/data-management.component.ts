import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from "@angular/forms";

@Component({
  selector: 'app-data-management',
  templateUrl: './data-management.component.html',
  styleUrls: ['./data-management.component.scss']
})

export class DataManagementComponent implements OnInit {

  federal_states: String[] = [
    'Baden-Württemberg',
    'Bayern',
    'Berlin',
    'Brandenburg',
    'Bremen',
    'Hamburg',
    'Hessen',
    'Mecklenburg-Vorpommern',
    'Niedersachsen',
    'Nordrhein-Westfalen',
    'Rheinland-Pfalz',
    'Saarland',
    'Sachsen',
    'Sachsen-Anhalt',
    'Schleswig-Holstein',
    'Thüringen'
  ]

  genders: String[] = [
    'männlich',
    'weiblich',
    'divers'
  ]

  education_degrees: String[] = [
    'kein Abschluss',
    'Hauptschulabschluss',
    'Realschulschluss',
    'Abitur / Allgemeine Hochschulreife',
    'Fachhochschulreife',
    'Diplom (Hochschule)',
    'Magister (Hochschule)',
    'Bachelor (Hochschule)',
    'Master (Hochschule)',
    'Doktor / Promotion (Hochschule)',
    'Geselle',
    'Meister',
    'Einfacher Dienst',
    'Mittlerer Dienst',
    'Gehobener Dienst',
    'Höherer Dienst'
  ]

  data_management = new FormGroup({
    job: new FormControl(''),
    education_degree: new FormControl(''),
    federal_state: new FormControl(''),
    salary: new FormControl(''),
    gender: new FormControl(''),
    age: new FormControl('')
  })
  
  constructor() { }

  ngOnInit(): void {
  }

  save(): void {
    
  }
}
