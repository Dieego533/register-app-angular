import { Injectable } from '@angular/core';
import { Auth , createUserWithEmailAndPassword, signInWithEmailAndPassword , signOut, 
  signInWithPopup, GoogleAuthProvider, onAuthStateChanged} from '@angular/fire/auth';
import { Firestore , collection , setDoc, doc , getDoc , query ,  getDocs, updateDoc, deleteDoc } from '@angular/fire/firestore';
import { UsersData } from '../interfaces/users-data';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';



@Injectable({
  providedIn: 'root'
})
export class UserService {
  private userId: string | null = null;

  constructor( 
    private router : Router, 
    private auth : Auth, 
    private firestore: Firestore,
    private toastr: ToastrService) 
  { 
    this.initAuthState();
  }

  //Estado de autenticación para mantener actualizado userId
  private initAuthState() {
    onAuthStateChanged(this.auth, (user) => {
      if (user) {
        this.userId = user.uid;
      } else {
        this.userId = null;
      }
    });
  }

  getUserId(): string | null {
    return this.userId;
  }

  // Registro para firebase
  async register(user: UsersData) {
    try {
      const { email, password, name, rut } = user;
      const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);
      const userId = userCredential.user.uid; // Obtiene el ID único del usuario registrado

      // Crea un documento para el usuario en Firestore y almacena los datos adicionales
      const userRef = doc(this.firestore, 'users', userId);
      await setDoc(userRef, {
        name: name,
        email : email,
        rut: rut,
        password: password
      });
      localStorage.setItem('userId',userCredential.user.uid);
      return 'Registro exitoso';
    } catch (error : any) {
      //Manejo de errores de firebase
      if (error.code == "auth/email-already-in-use") {
        this.toastr.error('', 'El Email ya se encuentra registrado');
      } else if (error.code == "auth/invalid-email") {
        this.toastr.error('', 'El Email no es válido');
      } else if (error.code == "auth/operation-not-allowed") {
        this.toastr.error('', 'Operación no permitida');
      } else if (error.code == "auth/weak-password") {
        this.toastr.error('', 'La contraseña no es válida');
      }

      console.log(error);
      throw error;
    }
  }

  
  login({email , password}:any){
    return signInWithEmailAndPassword(this.auth, email, password).then((userCredential) =>{
      localStorage.clear();
      const user = userCredential.user;
      localStorage.setItem('userId',user.uid);
    });
  }

  logout(){
    return signOut(this.auth).then(() =>{
      localStorage.clear();
    });
  }


  //Login con el botón de Google
  async loginWithGoogle(){
  try {
    const userCredential = await signInWithPopup(this.auth, new GoogleAuthProvider());
    const user = userCredential.user;

    // Verificar si el usuario ya existe en Firestore
    const userRef = doc(this.firestore, 'users', user.uid);
    const docSnap = await getDoc(userRef);

      if (!docSnap.exists()) {
        // Si el usuario no existe, registra sus datos
        await setDoc(userRef, {
          name: user.displayName || '',
          email: user.email || '',
          rut : '-',
          password : '-'
        });
        const userId = localStorage.setItem('userId',user.uid);
        this.router.navigate(['/updateGoogleUser']);
        console.log(userId);
        
      }else{
        const userId = localStorage.setItem('userId',user.uid);
        this.router.navigate(['/main']);
      }
    } catch (error) {
      console.error('Error al iniciar sesión con Google:', error);
      this.toastr.error('Error al iniciar sesión con Google', 'Error');
    }
  }

  //Actualizar los datos del usuario de Google
  updateGoogleUser({ name, rut }: any) {
    return new Promise((resolve, reject) => {
      const userId = localStorage.getItem('userId');
      if (userId) {
        const userRef = doc(this.firestore, 'users', userId);
        const updatedData = {
          name: name,
          rut: rut,
        };
        // Realiza la actualización en Firestore
        updateDoc(userRef, updatedData)
          .then(() => {
            console.log('Usuario actualizado con éxito');
            resolve('Usuario actualizado con éxito');
          })
          .catch(error => {
            console.error('Error al actualizar el usuario:', error);
            this.toastr.error('Error al actualizar el usuario', 'Error');
            reject(error);
          });
      } else {
        const error = 'El ID del usuario no está en el localStorage. Asegúrate de que el usuario haya iniciado sesión con Google.';
        this.toastr.error('Error en el registro con Google', 'Error');
        console.error(error);
        reject(error);
      }
    });
  }
  
  //Para obtener información del usuario autenticado.
  async getUserData(userId: string) {
    const userRef = doc(this.firestore, 'users', userId);
    const userDoc = await getDoc(userRef);
    if (userDoc.exists()) {
      const userData = userDoc.data();
      return userData;
    } else {
      console.log("El usuario no tiene datos en firestore")
      this.toastr.error('El usuario no tiene datos en firestore', 'Error');
      return null;
    }
  }

  //Para obtener todos los usuarios registrados
  async getUsers(): Promise<UsersData[]> {
    const usersCollection = collection(this.firestore, 'users');
    const usersQuery = query(usersCollection);
    //Hago la lectura en Firestore
    const usersCollectionData = await getDocs(usersQuery);
    //Mapeo a objetos UsersData y se almacenan en un arreglo.
    return usersCollectionData.docs.map((doc) => {
      const user = doc.data() as UsersData;
      user.id = doc.id;
      return user;
    });
  }

  async deleteUser(userId : string){
    const localStorageUserId = localStorage.getItem('userId');
    try {
      //Elimino de Firestore
      const userDocRef = doc(this.firestore , 'users' , userId);
      await deleteDoc(userDocRef);

      if(userId === localStorageUserId){
        this.router.navigate(['/login']);
      }
    } catch (error) {
      console.error('Error al eliminar la cuenta:', error);
      this.toastr.error('Error al eliminar la cuenta', 'Error');
    }
  }
}












