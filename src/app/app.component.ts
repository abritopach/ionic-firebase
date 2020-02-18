import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';

import * as firebase from 'firebase/app';
import { environment } from 'src/environments/environment';

// import { AuthGuard } from './services/user/auth.guard';
import { AuthService } from './services/user/auth.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-root',
    templateUrl: 'app.component.html',
    styleUrls: ['app.component.scss']
})
export class AppComponent {

    userLogged: firebase.User;

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

    constructor(private platform: Platform, /*private authGuard: AuthGuard,*/ private authService: AuthService,
                private router: Router) {
        this.initializeApp();
    }

    initializeApp() {
        firebase.initializeApp(environment.firebaseConfig);
        this.platform.ready().then(() => {
            //this.authGuard.authenticationState.subscribe(state => {
            this.authService.userState.subscribe(state => {
                this.userLogged = state;
            });
        });
    }

    async logOut(): Promise<void> {
        await this.authService.logout();
        this.router.navigateByUrl('login');
    }
}
