import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { ProfileManagementComponent } from './profile-management/profile-management.component';

const routes: Routes = [
  { path: 'profile', component: ProfileManagementComponent },
  { path: '', redirectTo: 'profile', pathMatch: 'full' },
  { path: 'login', component: LoginComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
