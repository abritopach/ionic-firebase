import { Component, OnInit } from '@angular/core';
import { EventService } from '../../services/event/event.service';
import { ActivatedRoute } from '@angular/router';

import { Event } from '../../models/event';

@Component({
    selector: 'app-event-detail',
    templateUrl: './event-detail.page.html',
    styleUrls: ['./event-detail.page.scss'],
})
export class EventDetailPage implements OnInit {

    private currentEvent: Event;
    private guestName = '';

    constructor(private eventService: EventService, private route: ActivatedRoute,) { }

    ngOnInit() {
        const eventId: string = this.route.snapshot.paramMap.get('id');
        this.eventService.getEventDetail(eventId).then(eventSnapshot => {
            this.currentEvent = eventSnapshot.data() as Event;
            this.currentEvent.id = eventSnapshot.id;
        });
    }

    addGuest(guestName: string): void {
        this.eventService.addGuest(guestName, this.currentEvent)
        .then(() => {
            this.currentEvent.revenue = this.currentEvent.revenue + this.currentEvent.price;
            this.guestName = '';
        });
    }

}
