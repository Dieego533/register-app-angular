import { Component, OnInit} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { FormBuilder, Validators } from '@angular/forms';
import  { UsersData }  from '../../interfaces/users-data';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  constructor(
    private userService: UserService,
    private router: Router,
    private fb: FormBuilder,
  ) {
    this.registerForm = this.fb.group({
      name:['' , Validators.required],
      rut:['' , Validators.required],
      email: ['' , Validators.required],
      password:['',Validators.required],
    })
  }

  ngOnInit(): void {
  }

  onSubmit() {
    if (this.registerForm.valid) {
      const name = this.registerForm.value.name; 
      const rut = this.registerForm.value.rut;
      const email = this.registerForm.value.email;
      const password = this.registerForm.value.password;

  
      const credentials : UsersData = { name, rut , email, password };
      console.log(credentials);
  
      this.userService.register(credentials)
        .then(response => {
          console.log(response);
          this.router.navigate(['/main']);
        })
        .catch(error => console.log(error));
    }
  }

}

