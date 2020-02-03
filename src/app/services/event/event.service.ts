import { Injectable } from '@angular/core';
import * as firebase from 'firebase/app';
import 'firebase/firestore';
import { AuthService } from '../user/auth.service';

import { Event } from '../../models/event';

@Injectable({
    providedIn: 'root'
})
export class EventService {

    // Hold our eventList collection.
    public eventListRef: firebase.firestore.CollectionReference;

    constructor(private authService: AuthService) { }

    async createEvent(newEvent: Event):
     Promise < firebase.firestore.DocumentReference > {
        const user: firebase.User = await this.authService.getUser();
        this.eventListRef = firebase.firestore().collection(`userProfile/${user.uid}/eventList`);
        // We are using .add() on the eventList sub-collection because we want firebase to append every
        // new document to this list, and to auto-generate a random ID, so we know there aren't going to
        // be two objects with the same ID.
        // Sometimes the function was trying to save the numbers as strings, so we're adding the * 1 to ensure
        // it's a number.

        newEvent.price = newEvent.price * 1;
        newEvent.cost = newEvent.cost * 1;
        newEvent.revenue = newEvent.cost * -1;

        return this.eventListRef.add(newEvent);
    }

    async getEventList(): Promise<firebase.firestore.QuerySnapshot> {
        const user: firebase.User = await this.authService.getUser();
        this.eventListRef = firebase.firestore().collection(`userProfile/${user.uid}/eventList`);
        return this.eventListRef.get();
    }

    async getEventDetail(eventId: string): Promise<firebase.firestore.DocumentSnapshot> {
        const user: firebase.User = await this.authService.getUser();
        this.eventListRef = firebase.firestore().collection(`userProfile/${user.uid}/eventList`);
        return this.eventListRef.doc(eventId).get();
    }

    async addGuest(guestName: string, eventId: string, eventPrice: number): Promise<void>/*Promise<firebase.firestore.DocumentReference>*/ {

        /*
        const user: firebase.User = await this.authService.getUser();
        this.eventListRef = firebase.firestore().collection(`userProfile/${user.uid}/eventList`);
        return this.eventListRef.doc(eventId).collection('guestList').add({ guestName });
        */

        return this.eventListRef
            .doc(eventId)
            .collection('guestList')
            .add({ guestName })
            .then((newGuest) => {
                return firebase.firestore().runTransaction(transaction => {
                    return transaction.get(this.eventListRef.doc(eventId)).then(eventDoc => {
                    const newRevenue = eventDoc.data().revenue + eventPrice;
                    transaction.update(this.eventListRef.doc(eventId), { revenue: newRevenue });
                });
            });
        });
    }

}
