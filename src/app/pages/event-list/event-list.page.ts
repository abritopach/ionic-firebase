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

    constructor(private eventService: EventService) { }

    ngOnInit() {
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
                return false;
            });
        });
      }

}
