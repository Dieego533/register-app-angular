import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from 'src/app/services/user.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent {
  loginForm : FormGroup;

  constructor(private fb: FormBuilder, private userService : UserService , private router : Router) {
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
      this.userService.login(credentials).then(res =>{
        this.router.navigate(['/main']);  
        console.log(res)
      }
      ).catch(error => console.log(error))
    }
  }

  onButtonClick() {
    this.userService.loginWithGoogle().then(res =>{
      this.router.navigate(['/main']);  
        console.log(res)
    }).catch(error => console.log(error))
  }

  onClickRegister(){
    this.router.navigate(['/register']);
  }

  
}
  



