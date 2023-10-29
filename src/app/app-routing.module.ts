import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { MainComponent } from './components/main/main.component';
import { canActivate, redirectUnauthorizedTo } from '@angular/fire/auth-guard';
import { GoogleAuthFormComponent } from './components/google-auth-form/google-auth-form.component';

//Rutas
const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'updateGoogleUser', component: GoogleAuthFormComponent },
  { path: 'main', component: MainComponent, ...canActivate(()=>redirectUnauthorizedTo(["/login"]))},
  { path: '', redirectTo: '/login', pathMatch: 'full' }, // Redirecciona a 'login' por defecto
  { path: '**', redirectTo: '/login' }, // Redirecciona a 'login' para rutas no encontradas
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
