import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';

import * as firebase from 'firebase/app';
import { environment } from 'src/environments/environment';

import { AuthGuard } from './services/user/auth.guard';

@Component({
    selector: 'app-root',
    templateUrl: 'app.component.html',
    styleUrls: ['app.component.scss']
})
export class AppComponent {

    isUserLogged = false;

    public appPages = [
        {
            title: 'Home',
            url: '/home',
            icon: 'home'
        },
        {
            title: 'Events',
            url: '/event-list',
            icon: 'list-outline'
        }
    ];

    constructor(private platform: Platform, private authGuard: AuthGuard) {
        this.initializeApp();
    }

    initializeApp() {
        firebase.initializeApp(environment.firebaseConfig);
        this.platform.ready().then(() => {
            this.authGuard.authenticationState.subscribe(state => {
                this.isUserLogged = state;
            });
        });
    }
}
