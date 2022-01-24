import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CompareComponent } from '@comp/compare/compare.component';
import { AuthGuard } from '@auth0/auth0-angular';
import { StartPageComponent } from './components/start-page/start-page.component';
import { SupportPageComponent } from './components/support-page/support-page.component';
import { ProfileManagementComponent } from './components/profile-management/profile-management.component';
import { LoginSuccessComponent } from '@comp/login-success/login-success.component';

const routes: Routes = [
  { path: 'compare', component: CompareComponent, canActivate: [AuthGuard] },
  { path: 'profile', component: ProfileManagementComponent ,canActivate: [AuthGuard]},
  { path: 'start', component: StartPageComponent },
  { path: 'support', component: SupportPageComponent},
  { path: 'success', component: LoginSuccessComponent},
  { path: '', redirectTo: 'start', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
