import { Component, OnInit } from '@angular/core';

import { Router } from '@angular/router';
import { EventService } from '../../services/event/event.service';

import { Event } from '../../models/event';

@Component({
    selector: 'app-event-create',
    templateUrl: './event-create.page.html',
    styleUrls: ['./event-create.page.scss'],
})
export class EventCreatePage implements OnInit {

    event: Event = {
        name: '',
        cost: 0,
        date: new Date(),
        price: 0,
        revenue: 0
    };

    constructor(private router: Router, private eventService: EventService) { }

    ngOnInit() {
    }

    createEvent(): void {
        if (this.event.name === '') {
            return;
        }
        this.eventService.createEvent(this.event).then(() => {
            // Go back to the HomePage.
            this.router.navigateByUrl('event-list');
        });
    }

}
