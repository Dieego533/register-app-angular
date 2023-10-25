import { Component } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent {

  constructor(private userService : UserService, private router : Router) {

  }

  onButtonClick() {
    // Aquí puedes agregar la lógica que deseas ejecutar cuando se hace clic en el botón.
    // this.userService.logout().then((res: any) => {
    //   console.log(res);
    //   this.router.navigate(['/login']);
    // }).catch((err: any) => console.log(err));
  }

}
