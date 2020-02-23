import { Component, OnInit } from '@angular/core';
import { NavParams, ModalController } from '@ionic/angular';

@Component({
    selector: 'app-event-modal',
    templateUrl: './event-modal.component.html',
    styleUrls: ['./event-modal.component.scss'],
})
export class EventModalComponent implements OnInit {

    constructor(private navParams: NavParams, private modalCtrl: ModalController) { }

    ngOnInit() {
    }

    dismiss() {
        // Using the injected ModalController this page
        // can "dismiss" itself and pass back data.
        this.modalCtrl.dismiss();
    }

    handleEvent(event) {
        this.modalCtrl.dismiss(event);
    }

}
