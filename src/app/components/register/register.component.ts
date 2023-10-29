import { Component, OnInit} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { FormBuilder, Validators } from '@angular/forms';
import  { UsersData }  from '../../interfaces/users-data';
import { ToastrService } from 'ngx-toastr';


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
    private toastr: ToastrService
  ) {
    this.registerForm = this.fb.group({
      name:['' , [Validators.required, Validators.pattern(/^[A-Za-zÁ-Úá-ú\s]+$/)]],
      rut:['' , [Validators.required, Validators.pattern(/^\d{7,8}-[\dkK]$/)]],
      email: ['' , [Validators.required, Validators.email]],
      password:['',[Validators.required, Validators.minLength(8), Validators.pattern(/[A-Z]/)]],
    })


  }

  ngOnInit(): void {
  }

  onSubmit() {
    if (this.registerForm.valid) {
      const name = this.registerForm.value.name; 
      const rutBruto = this.registerForm.value.rut;
      const rut = rutBruto.replace('-', '');
      const email = this.registerForm.value.email;
      const password = this.registerForm.value.password;

  
      const credentials : UsersData = { name, rut , email, password };
      console.log(credentials);
  
      this.userService.register(credentials)
        .then(response => {
          console.log(response);
          this.toastr.success('Registro Exitoso!', 'Éxito');
          this.router.navigate(['/main']);
        })
        .catch(error => {
          this.toastr.error('', 'No se pudo completar el registro');
          console.log(error);
        });
    }else{
      console.log("Hay un problema con el formulario");
      this.toastr.error('', 'Hay un error en el formulario');
    }
  }

  goBack() {
    // Redirige a la página anterior (por ejemplo, la página de inicio de sesión)
    this.router.navigate(['/login']);
  }

}

