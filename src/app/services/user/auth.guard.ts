import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';

// We're importing the core of Firebase functionality and then adding the auth
// functionality to the namespace.
import * as firebase from 'firebase/app';
import 'firebase/auth';

@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate {

    constructor(private router: Router) {}

    canActivate(
        next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
        return new Promise((resolve, reject) => {
            // We're using the onAuthStateChanged() function to see if there's a user, if there is, we
            // resolve the promise with true, if there isn't, we send back false and use the router to
            // redirect the user to the login page.
            firebase.auth().onAuthStateChanged((user: firebase.User) => {
                if (user) {
                resolve(true);
                } else {
                console.log('User is not logged in');
                this.router.navigate(['/login']);
                resolve(false);
                }
            });
        });
    }
}
