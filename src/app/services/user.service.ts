import { Injectable } from '@angular/core';
import { Auth , createUserWithEmailAndPassword, signInWithEmailAndPassword , signOut, 
  signInWithPopup, GoogleAuthProvider, onAuthStateChanged, UserCredential, getAuth   } from '@angular/fire/auth';
import { Firestore , collection, addDoc , setDoc, doc , getDoc , query ,  getDocs } from '@angular/fire/firestore';
import { UsersData } from '../interfaces/users-data';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private userId: string | null = null;

  constructor( private auth : Auth , private firestore: Firestore) { 
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



  login({email , password}:any){
    return signInWithEmailAndPassword(this.auth, email, password);
  }

  logout(){
    return signOut(this.auth);
  }

  loginWithGoogle(){
    return signInWithPopup(this.auth, new GoogleAuthProvider());
  }


}


  


 



