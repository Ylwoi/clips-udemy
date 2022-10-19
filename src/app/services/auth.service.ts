import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { ActivatedRoute, NavigationEnd, Route, Router } from '@angular/router';
import { delay, filter, map, Observable, of, switchMap } from 'rxjs';
import IUser from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private userCollection: AngularFirestoreCollection<IUser>
  isAuthenticated$: Observable<boolean>
  redirect: boolean = false

  constructor(
    private auth: AngularFireAuth,
    private router: Router,
    private route: ActivatedRoute,
    private db: AngularFirestore
    ) {
        this.userCollection = db.collection('users')
        this.isAuthenticated$ = auth.user.pipe(
          delay(1000),
          map(user => !!user)
        )

        this.router.events.pipe(
          filter(e => e instanceof NavigationEnd),
          map(e => this.route.firstChild),
          switchMap(route => route?.data ?? of({}))
        ).subscribe(data => {
          this.redirect = data['authOnly'] ?? false
        })
      }

  async addUser(userData: IUser) {
    const userCred = await this.auth.createUserWithEmailAndPassword(userData.email as string, userData.password as string)

    if (!userCred.user) {
      throw new Error("User ID missing");
    }
    await this.userCollection.doc(userCred.user.uid).set({
      email: userData.email,
      name: userData.name,
      age: userData.age,
      phone: userData.phone
    })

    await userCred.user.updateProfile({
      displayName: userData.name
    })
  }

  async loginUser(email: string, password: string) {
    await this.auth.signInWithEmailAndPassword(email, password)
  }

  async logoutUser(event?: Event) {
    event?.preventDefault()

    await this.auth.signOut()

    if (this.redirect) {
      await this.router.navigateByUrl('/')
    }
  }
}
