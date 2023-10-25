import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { Router } from '@angular/router';
import { UsersData } from 'src/app/interfaces/users-data';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {
  userId: string | null = "";
  userData : any;
  displayedColumns: string[] = ['id', 'name', 'rut', 'email', 'password'];

  constructor(private userService : UserService, private router : Router) {
    this.userData = {}
  }

    async ngOnInit() {
      this.getDataUser();
    }

    async getDataUser(){
      this.userId = this.userService.getUserId();
      if (this.userId) {
        try {
          // El usuario está autenticado, obtén sus datos
          this.userData = await this.userService.getUserData(this.userId);
          if (this.userData) {
            // Los datos del usuario se cargaron con éxito
            console.log(this.userData);
          } else {
            // El usuario no tiene datos en Firestore
            console.log("El usuario no tiene datos en Firestore");
          }
        } catch (error) {
          console.error("Error al obtener los datos del usuario:", error);
        }
      } else {
        // El usuario no está autenticado.
      }
    }

    onButtonClick() {
      console.log(this.userData);
      // Aquí puedes agregar la lógica que deseas ejecutar cuando se hace clic en el botón.
      this.userService.logout().then((res: any) => {
        console.log(res);
        this.router.navigate(['/login']);
      }).catch((err: any) => console.log(err));
    }
  
  }
  

  
