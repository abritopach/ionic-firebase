import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';

import * as firebase from 'firebase/app';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'app-root',
    templateUrl: 'app.component.html',
    styleUrls: ['app.component.scss']
})
export class AppComponent {

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

    constructor(private platform: Platform) {
        this.initializeApp();
    }

    initializeApp() {
        firebase.initializeApp(environment.firebaseConfig);
            this.platform.ready().then(() => {
        });
    }
}
