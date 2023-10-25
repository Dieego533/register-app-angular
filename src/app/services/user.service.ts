import { Injectable } from '@angular/core';
import { Auth , createUserWithEmailAndPassword, signInWithEmailAndPassword , signOut, signInWithPopup, GoogleAuthProvider } from '@angular/fire/auth';
import { Firestore , collection, addDoc } from '@angular/fire/firestore';
import { UsersData } from '../interfaces/users-data';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor( private auth : Auth , private firestore: Firestore) { 
  }

  register(user : UsersData){
    const userRef = collection(this.firestore, 'users');
    return addDoc(userRef, user);
  }
  //Registro para firebase
  // register({email,password}:any){
  //   return createUserWithEmailAndPassword(this.auth, email, password);
  // }

  // login({email , password}:any){
  //   return signInWithEmailAndPassword(this.auth, email, password);
  // }

  // loginWithGoogle(){
  //   return signInWithPopup(this.auth, new GoogleAuthProvider());
  // }

  // logout(){
  //   return signOut(this.auth);
  // }

  
}
