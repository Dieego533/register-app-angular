import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { Router } from '@angular/router';
import { UsersData } from 'src/app/interfaces/users-data';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {
  userId: string | null = "";
  userData : any;
  users: UsersData[] = [];
  displayedColumns: string[] = ['id', 'name', 'rut', 'email', 'password'];
  showSpinner: boolean = true;

  constructor(private userService : UserService, private router : Router, private toastr: ToastrService) {
    this.userData = {}
  }

    async ngOnInit() {
      this.getDataUser();
      this.getUsers();
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
          this.toastr.error('', 'Error al obtener los datos del usuario');
        }
      } else {
        this.toastr.error('', 'Ocurrió un error al cargar los datos del usuario');
      }
    }

    async getUsers() {
      // Obtener la lista de usuarios registrados
      this.users = await this.userService.getUsers();
      this.showSpinner = false;
      
    }


    onLogout(){
      this.userService.logout().then((res) => {
        this.toastr.success('', 'Sesión Cerrada', {
          timeOut: 3000,
        });
        this.router.navigate(['/login']);
        
      })
    }
  
  }
  

  
