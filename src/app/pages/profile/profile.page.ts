import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/user/auth.service';
import { Router } from '@angular/router';
import { ProfileService } from 'src/app/services/user/profile.service';
import { AlertController } from '@ionic/angular';
import { UserProfile } from 'src/app/models/user';

import { Plugins, CameraResultType } from '@capacitor/core';
const { Camera } = Plugins;

@Component({
    selector: 'app-profile',
    templateUrl: './profile.page.html',
    styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

    // Using @angular/fire.
    // public userProfile: UserProfile;
    public userProfile: UserProfile;

    constructor(private authService: AuthService, private router: Router, private profileService: ProfileService,
                private alertCtrl: AlertController) { }

    ngOnInit() {

        // Using @angular/fire.
        /*
        this.profileService.getUserProfile().then(profile$ => {
            profile$.subscribe(userProfile => {
                this.userProfile = userProfile;
            });
        });
        */

        this.profileService.getUserProfile().then(userProfileSnapshot => {
            if (userProfileSnapshot.data()) {
                this.userProfile = userProfileSnapshot.data() as UserProfile;
            }
        });
    }

    async updateName(): Promise<void> {
        const alert = await this.alertCtrl.create({
            subHeader: 'Your name',
            inputs: [
            {
                type: 'text',
                name: 'fullName',
                placeholder: 'Your full name',
                value: this.userProfile.fullName
            }
            ],
            buttons: [
                { text: 'Cancel' },
                {
                    text: 'Save',
                    handler: data => {
                        this.profileService.updateName(data.fullName).then(() => {
                            this.userProfile.fullName = data.fullName;
                        })
                        .catch(error => {
                            console.log('ERROR: ' + error.message);
                        });
                    }
                }
            ]
        });
        return await alert.present();
    }

    updateDOB(birthDate: string): void {
        if (birthDate === undefined) {
          return;
        }
        this.profileService.updateDOB(birthDate).then(() => {
            this.userProfile.birthDate = birthDate;
        })
        .catch(error => {
            console.log('ERROR: ' + error.message);
        });
     }

    async updateEmail(): Promise<void> {
        const alert = await this.alertCtrl.create({
            inputs: [
                { type: 'text', name: 'newEmail', placeholder: 'Your new email' },
                { name: 'password', placeholder: 'Your password', type: 'password' }
            ],
            buttons: [
                { text: 'Cancel' },
                {
                    text: 'Save',
                    handler: data => {
                        this.profileService.updateEmail(data.newEmail, data.password).then(() => {
                            this.userProfile.email = data.newEmail;
                        })
                        .catch(error => {
                            console.log('ERROR: ' + error.message);
                        });
                    }
                }
            ]
        });
        return await alert.present();
    }

    async updatePassword(): Promise<void> {
        const alert = await this.alertCtrl.create({
            inputs: [
                { name: 'newPassword', placeholder: 'New password', type: 'password' },
                { name: 'oldPassword', placeholder: 'Old password', type: 'password' }
            ],
            buttons: [
                { text: 'Cancel' },
                {
                    text: 'Save',
                    handler: data => {
                        this.profileService.updatePassword(data.newPassword, data.oldPassword);
                    }
                }
            ]
        });
        return await alert.present();
    }

    async takePicture(): Promise<void> {
        try {
            // We are calling the Camera API from Capacitor and giving it a few options, most of them are obvious
            //  by their names, the most important one is resultType because it's the one that will give you the
            // format of the image, either a base64 string or the native path to the actual file.
            // We're using the base64 string because Firebase Cloud Storage has a .putString() method that takes
            // a base64 string and uploads the picture from it.
            const profilePicture = await Camera.getPhoto({quality: 90, allowEditing: false, resultType: CameraResultType.Base64});
            console.log(profilePicture);
        } catch (error) {
            console.error(error);
        }
    }

}
