import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CompareComponent } from './compare/compare.component';

const routes: Routes = [
  { path: 'compare', component: CompareComponent },
  { path: '', redirectTo: 'compare', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
