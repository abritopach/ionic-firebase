import { Component, OnInit } from '@angular/core';
import { EventService } from '../../services/event/event.service';
import { ActivatedRoute } from '@angular/router';

import { Event } from '../../models/event';

import { Plugins, CameraResultType } from '@capacitor/core';
const { Camera } = Plugins;

@Component({
    selector: 'app-event-detail',
    templateUrl: './event-detail.page.html',
    styleUrls: ['./event-detail.page.scss'],
})
export class EventDetailPage implements OnInit {

    private currentEvent: Event;
    private guestName = '';
    private guestPicture: string = null;
    guestList = [];

    constructor(private eventService: EventService, private route: ActivatedRoute,) { }

    ngOnInit() {
        const eventId: string = this.route.snapshot.paramMap.get('id');
        this.eventService.getEventDetail(eventId).then(eventSnapshot => {
            this.currentEvent = eventSnapshot.data() as Event;
            this.currentEvent.id = eventSnapshot.id;
        });
        this.getEventGuestsList(eventId);
    }

    addGuest(guestName: string): void {
        this.eventService.addGuest(guestName, this.currentEvent, this.guestPicture)
        .then(() => {
            this.currentEvent.revenue = this.currentEvent.revenue + this.currentEvent.price;
            this.guestName = '';
            this.guestPicture = null;
        });
    }

    async takePicture(): Promise<void> {
        try {
            // We are calling the Camera API from Capacitor and giving it a few options, most of them are obvious
            //  by their names, the most important one is resultType because it's the one that will give you the
            // format of the image, either a base64 string or the native path to the actual file.
            // We're using the base64 string because Firebase Cloud Storage has a .putString() method that takes
            // a base64 string and uploads the picture from it.
            const profilePicture = await Camera.getPhoto({quality: 90, allowEditing: false, resultType: CameraResultType.Base64});
            this.guestPicture = profilePicture.base64String;
        } catch (error) {
            console.error(error);
        }
    }

    getEventGuestsList(eventId: string) {
        this.eventService.getEventGuestsList(eventId).then(eventGuestsListSnapshot => {
            eventGuestsListSnapshot.forEach(snap => {
                console.log(snap.data().guestName)
                this.guestList.push(snap.data().guestName);
            });
        });
    }

    deleteGuest(guest: string) {
        // TODO: Delete guest.
    }

}
