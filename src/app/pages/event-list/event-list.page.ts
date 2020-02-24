import { Component, OnInit } from '@angular/core';

import { EventService } from '../../services/event/event.service';

import { Event } from '../../models/event';
import { EventModalComponent } from 'src/app/modals/event-modal/event-modal.component';
import { ModalController } from '@ionic/angular';

@Component({
    selector: 'app-event-list',
    templateUrl: './event-list.page.html',
    styleUrls: ['./event-list.page.scss'],
})
export class EventListPage implements OnInit {

    private eventList: Array<Event>;
    private eventGuests = {};

    constructor(private eventService: EventService, private modalCtrl: ModalController) {
    }

    ngOnInit() {
    }

    ionViewDidEnter() {
        this.getEventList();
    }

    getEventList() {
        this.eventService.getEventList().then(eventListSnapshot => {
            this.eventList = [];
            eventListSnapshot.forEach(snap => {
                this.eventList.push({
                    id: snap.id,
                    name: snap.data().name,
                    price: snap.data().price,
                    date: snap.data().date,
                    cost: snap.data().cost,
                    revenue: snap.data().revenue
                });

                this.getEventGuestsList(snap.id);
                return false;
            });
        });
    }

    getEventGuestsList(eventId: string) {
        this.eventService.getEventGuestsList(eventId).then(eventGuestsListSnapshot => {
            this.eventGuests[eventId] = eventGuestsListSnapshot.size;
            eventGuestsListSnapshot.forEach(snap => {
                return false;
            });
        });
    }

    deleteEvent(eventId: string) {
        this.eventService.deleteEvent(eventId).then(() => {
            console.log(`Event ${eventId} successfully deleted!`);
            this.getEventList();
        }).catch((error) => {
            console.error(`Error removing event ${eventId}: ${error}`);
        });
    }

    async presentEventModal(title: string, buttonText: string, eventId?: string) {
        const isEditMode = buttonText === 'Edit';
        const event = isEditMode ? this.eventList.filter(e => e.id === eventId).pop() : null;
        const componentProps = { modalProps: { title, buttonText, isEditMode, event}};
        const modal = await this.modalCtrl.create({
            component: EventModalComponent,
            componentProps
        });
        await modal.present();
        const {data} = await modal.onWillDismiss();
        if (data) {
            if (isEditMode) {
                console.log('Edit event');
                this.updateEvent(eventId, data);
            }
            else {
                console.log('Create event');
                this.createEvent(data);
            }
        }
    }

    createEvent(event: Event): void {
        if (event.name === '') {
            return;
        }
        this.eventService.createEvent(event).then(() => {
            this.getEventList();
        });
    }

    updateEvent(eventId: string, updatedEvent: Event) {
        this.eventService.updateEvent(eventId, updatedEvent).then(() => {
            this.getEventList();
        });
    }

}
