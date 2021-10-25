import { Component, OnInit } from '@angular/core';

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

  constructor() { }

  ngOnInit(): void {
  }

}
