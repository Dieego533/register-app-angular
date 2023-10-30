import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from 'src/app/services/user.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-google-auth-form',
  templateUrl: './google-auth-form.component.html',
  styleUrls: ['./google-auth-form.component.css']
})
export class GoogleAuthFormComponent {
  
  registrationForm: FormGroup;
  constructor(private fb: FormBuilder, private userService: UserService , private router: Router, private toastr: ToastrService) {
    this.registrationForm = this.fb.group({
      name:['' , [Validators.required, Validators.pattern(/^[A-Za-zÁ-Úá-ú\s]+$/)]], //Solo letras y espacios en blanco.
      rut:['' , [Validators.required, Validators.pattern(/^\d{7,8}-[\dkK]$/)]], //Formato de rut con guión.
    });
  }

  onSubmit(){
    if (this.registrationForm.valid) {
      const user = {
        name: this.registrationForm.value.name,
        rut: this.registrationForm.value.rut,
      };
      this.userService.updateGoogleUser(user).then(res =>{
        console.log(res);
        this.toastr.success('', 'Sesión Iniciada');
        this.router.navigate(['/main']); 
      })
      .catch(error => {
        console.log(error);
        this.toastr.error('', 'No se pudieron actualizar los datos del registro');
      });
    }
    
  }

}
