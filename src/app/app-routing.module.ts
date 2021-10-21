import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DataManagementComponent } from '@shared/data-management/data-management.component';

const routes: Routes = [
  { path: 'data-management', component: DataManagementComponent },
  { path: '', redirectTo: 'data-management', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
