import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProfileManagementComponent } from './profile-management/profile-management.component';

const routes: Routes = [
  { path: 'profile', component: ProfileManagementComponent },
  { path: 'compare', redirectTo: 'profile', pathMatch: 'full'},
  { path: '', redirectTo: 'profile', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
