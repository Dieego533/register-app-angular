import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from 'src/app/services/user.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent {
  loginForm : FormGroup;
  showSpinner: boolean = false;


  constructor(private fb: FormBuilder, 
    private userService : UserService, 
    private router : Router, 
    private toastr: ToastrService) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const email = this.loginForm.value.email;
      const password = this.loginForm.value.password;
      const credentials = { email , password }
      console.log(credentials);
      this.showSpinner = true;
      this.userService.login(credentials).then(res =>{
        this.toastr.success('', 'Sesión Iniciada', {
          timeOut: 3000,
        });
        this.router.navigate(['/main']);  
        console.log(res)
        this.showSpinner = false;
      }
      ).catch(error => {
        this.toastr.error('', 'Usuario y/o Contraseña inválidos');
        console.log(error);
        this.showSpinner = false;
      })
    }
  }

  googleloginButton() {
    this.userService.loginWithGoogle().then(res =>{ 
        console.log(res)
    }).catch(error => console.log(error))
  }

  onClickRegister(){
    this.router.navigate(['/register']);
  }

  
}
  



