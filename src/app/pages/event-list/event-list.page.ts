import { Component, OnInit } from '@angular/core';

import { EventService } from '../../services/event/event.service';

import { Event } from '../../models/event';

@Component({
    selector: 'app-event-list',
    templateUrl: './event-list.page.html',
    styleUrls: ['./event-list.page.scss'],
})
export class EventListPage implements OnInit {

    private eventList: Array<Event>;
    private eventGuests = {};

    constructor(private eventService: EventService) { }

    ngOnInit() {
        console.log('EventListPage::ngOnInit');
    }

    ionViewDidEnter() {
        console.log('EventListPage::ionViewDidEnter');
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
        console.log('EventListPage::deleteEvent');
        this.eventService.deleteEvent(eventId).then(() => {
            console.log(`Event ${eventId} successfully deleted!`);
            this.eventList = this.eventList.filter(event => event.id !== eventId);
        }).catch((error) => {
            console.error(`Error removing event ${eventId}: ${error}`);
        });
    }

}
