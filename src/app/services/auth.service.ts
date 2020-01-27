import { Injectable } from '@angular/core';

// Access the authentication module.
import { AngularFireAuth } from '@angular/fire/auth';
// Access the Firestore module.
import { AngularFirestore } from '@angular/fire/firestore';
// Transform the current user response from an observable into a promise.
import { first } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    public userId: string;

    constructor(private angularFireAuth: AngularFireAuth, private angularFirestore: AngularFirestore) { }

    // Return the current user.
    getUser(): Promise<firebase.User> {
        return this.angularFireAuth.authState.pipe(first()).toPromise();
    }

    login(email: string, password: string): Promise<firebase.auth.UserCredential> {
        return this.angularFireAuth.auth.signInWithEmailAndPassword(email, password);
    }

    // Add new users to our app, that one might be a bit trickier, because it needs to do two things,
    // 1) it needs to create the new user and
    // 2) it needs to add that user's information to the database.
    async signup(email: string, password: string): Promise<firebase.auth.UserCredential> {
        try {
            const newUserCredential: firebase.auth.UserCredential =
            await this.angularFireAuth.auth.createUserWithEmailAndPassword(email, password);
            await this.angularFirestore
            .doc(`userProfile/${newUserCredential.user.uid}`)
            .set({ email });
            return newUserCredential;
        }  catch (error) {
            throw error;
        }
    }

    // Takes in the user's email and sends a link to reset the user's password.
    resetPassword(email: string): Promise<void> {
        return this.angularFireAuth.auth.sendPasswordResetEmail(email);
    }

    logout(): Promise<void> {
        return this.angularFireAuth.auth.signOut();
    }
}
