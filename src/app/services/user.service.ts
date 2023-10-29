import { Injectable } from '@angular/core';
import { Auth , createUserWithEmailAndPassword, signInWithEmailAndPassword , signOut, 
  signInWithPopup, GoogleAuthProvider, onAuthStateChanged, UserCredential, getAuth } from '@angular/fire/auth';
import { Firestore , collection, addDoc , setDoc, doc , getDoc , query ,  getDocs, updateDoc } from '@angular/fire/firestore';
import { UsersData } from '../interfaces/users-data';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';



@Injectable({
  providedIn: 'root'
})
export class UserService {
  private userId: string | null = null;

  constructor( private router : Router , private auth : Auth , private firestore: Firestore, private toastr: ToastrService) { 
    this.initAuthState();
  }

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
      return 'Registro exitoso';
    } catch (error) {
      console.log(error);
      throw error;
      
    }
  }

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
        this.router.navigate(['/main']);
      }
    } catch (error) {
      console.error('Error al iniciar sesión con Google:', error);
    }
  }

  updateGoogleUser({ name, rut }: any) {
    return new Promise((resolve, reject) => {
      const userId = localStorage.getItem('userId');
      if (userId) {
        const userRef = doc(this.firestore, 'users', userId);
  
        // Aquí defines los campos que deseas actualizar
        const updatedData = {
          name: name,
          rut: rut,
          // Agrega todos los campos que necesitas actualizar
        };
  
        // Realiza la actualización en Firestore
        updateDoc(userRef, updatedData)
          .then(() => {
            console.log('Usuario actualizado con éxito');
            resolve('Usuario actualizado con éxito');
          })
          .catch(error => {
            console.error('Error al actualizar el usuario:', error);
            reject(error);
          });
      } else {
        const error = 'El ID del usuario no está en el localStorage. Asegúrate de que el usuario haya iniciado sesión con Google.';
        console.error(error);
        reject(error);
      }
    });
  }
  

  async getUserData(userId: string) {
    const userRef = doc(this.firestore, 'users', userId);
    const userDoc = await getDoc(userRef);
    if (userDoc.exists()) {
      const userData = userDoc.data();
      // userData contiene los datos del usuario (nombre, rut, correo electrónico, etc.).
      // Puedes hacer lo que necesites con estos datos.
      return userData;
    } else {
      console.log("El usuario no tiene datos en firestore")
      // El usuario no tiene datos en Firestore.
      return null;
    }
  }

  async getUsers(): Promise<UsersData[]> {
    const usersCollection = collection(this.firestore, 'users');
    const usersQuery = query(usersCollection);

    const userSnapshots = await getDocs(usersQuery);

    return userSnapshots.docs.map((doc) => {
      const user = doc.data() as UsersData;
      user.id = doc.id;
      return user;
    });
  }

  async checkUserData(userId: string): Promise<boolean> {
    const userRef = doc(this.firestore, 'users', userId);
    const userDoc = await getDoc(userRef);

    return userDoc.exists();
  }



  login({email , password}:any){
    return signInWithEmailAndPassword(this.auth, email, password);
  }

  logout(){
    return signOut(this.auth);
  }

 

}


  


 



