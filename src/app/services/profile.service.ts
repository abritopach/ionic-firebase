import { Injectable } from '@angular/core';

import {AngularFirestore, AngularFirestoreDocument} from '@angular/fire/firestore';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';

import * as firebase from 'firebase/app';
import 'firebase/auth';
import { UserProfile } from '../models/user';

@Injectable({
    providedIn: 'root'
})
export class ProfileService {

    // Hold the document for the profile in the database.
    private userProfile: AngularFirestoreDocument<UserProfile>;
    // Hold our authentication object for the user.
    private currentUser: firebase.User;

    constructor(private firestore: AngularFirestore, private authService: AuthService) { }

    async getUserProfile(): Promise<Observable<UserProfile>> {
        const user: firebase.User = await this.authService.getUser();
        this.currentUser = user;
        this.userProfile = this.firestore.doc(`userProfile/${user.uid}`);
        // Returns that document's .valueChanges() (which converts that document to an observable).
        return this.userProfile.valueChanges();
    }

    updateName(fullName: string): Promise<void> {
        return this.userProfile.update({ fullName });
    }

    // Now we need a function to update the user's email, notice that we don't only need to update it from
    // the Firestore database, we also need to modify the authentication object to have the new email.
    async updateEmail(newEmail: string, password: string): Promise<void> {
        const credential: firebase.auth.AuthCredential = firebase.auth.EmailAuthProvider.credential(
            this.currentUser.email,
            password
        );
        try {
            await this.currentUser.reauthenticateWithCredential(credential);
            await this.currentUser.updateEmail(newEmail);
            return this.userProfile.update({ email: newEmail });
        } catch (error) {
            console.error(error);
        }
    }

    async updatePassword(newPassword: string, oldPassword: string): Promise<void> {
        const credential: firebase.auth.AuthCredential = firebase.auth.EmailAuthProvider.credential(
            this.currentUser.email,
            oldPassword
        );
        try {
            await this.currentUser.reauthenticateWithCredential(credential);
            return this.currentUser.updatePassword(newPassword);
        } catch (error) {
            console.error(error);
        }
    }
}
