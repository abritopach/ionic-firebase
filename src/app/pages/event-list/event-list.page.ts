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
        this.getEventList();
    }

    getEventList() {
        this.eventService.getEventList().then(eventListSnapshot => {
            this.eventList = [];
            console.log(eventListSnapshot);
            eventListSnapshot.forEach(snap => {
                console.log(snap);
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
            console.log(eventGuestsListSnapshot.size);
            eventGuestsListSnapshot.forEach(snap => {
                console.log(snap.data().guestName);
                return false;
            });
        });
    }

}
