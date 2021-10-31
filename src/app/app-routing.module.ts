import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '@auth0/auth0-angular';
import { StartPageComponent } from './components/start-page/start-page.component';
import { SupportPageComponent } from './components/support-page/support-page.component';
import { ProfileManagementComponent } from './profile-management/profile-management.component';


const routes: Routes = [
  { path: 'profile', component: ProfileManagementComponent ,canActivate: [AuthGuard]},
  { path: '', redirectTo: 'profile', pathMatch: 'full' },
  { path: 'start', component: StartPageComponent },
  { path: 'support', component: SupportPageComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
