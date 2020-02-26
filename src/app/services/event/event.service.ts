import { Injectable } from '@angular/core';
import * as firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/storage';
import { AuthService } from '../user/auth.service';

import { Event } from '../../models/event';
import { Guest } from 'src/app/models/guest';

@Injectable({
    providedIn: 'root'
})
export class EventService {

    // Hold our eventList collection.
    public eventListRef: firebase.firestore.CollectionReference;

    constructor(private authService: AuthService) { }

    async createEvent(newEvent: Event): Promise <firebase.firestore.DocumentReference> {
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

    async detectEventsChanges() {
        const user: firebase.User = await this.authService.getUser();
        this.eventListRef = firebase.firestore().collection(`userProfile/${user.uid}/eventList`);
        this.eventListRef.onSnapshot(querySnapshot => {
            querySnapshot.docChanges().forEach(change => {
                if (change.type === "added") {
                    console.log("New event: ", change.doc.data());
                }
                if (change.type === "modified") {
                    console.log("Modified event: ", change.doc.data());
                }
                if (change.type === "removed") {
                    console.log("Removed event: ", change.doc.data());
                }
            });
        });
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

    async addGuest(guestName: string, event: Event, guestPicture: string = null): Promise<void>
    /*Promise<firebase.firestore.DocumentReference>*/ {

        /*
        const user: firebase.User = await this.authService.getUser();
        this.eventListRef = firebase.firestore().collection(`userProfile/${user.uid}/eventList`);
        return this.eventListRef.doc(eventId).collection('guestList').add({ guestName });
        */

        return this.eventListRef
        .doc(event.id)
        .collection('guestList')
        .add({ guestName })
        .then((newGuest) => {
            return firebase.firestore().runTransaction(transaction => {
                return transaction.get(this.eventListRef.doc(event.id)).then(eventDoc => {
                const newRevenue = eventDoc.data().revenue + event.price;
                transaction.update(this.eventListRef.doc(event.id), { revenue: newRevenue });

                if (guestPicture != null) {
                    const storageRef = firebase
                    .storage()
                        // We are creating a reference to our Firebase Storage.
                    .ref(`/guestProfile/${newGuest.id}/profilePicture.png`);
                    return storageRef
                        // We store our file. To save it we use the .putString() method, and pass it the
                        // base64 string we got from the Camera Plugin.
                        .putString(guestPicture, 'base64', { contentType: 'image/png' })
                        .then(() => {
                            return storageRef.getDownloadURL().then(downloadURL => {
                                return this.eventListRef
                                .doc(event.id)
                                .collection('guestList')
                                .doc(newGuest.id)
                                .update({ profilePicture: downloadURL });
                            });
                        });
                    }
                });
            });
        });
    }

    async getEventGuestsList(eventId: string): Promise<firebase.firestore.QuerySnapshot> {
        const user: firebase.User = await this.authService.getUser();
        const guestList = firebase.firestore().collection(`userProfile/${user.uid}/eventList/${eventId}/guestList`);
        return guestList.get();
    }

    async deleteEvent(eventId: string): Promise<void> {
        const user: firebase.User = await this.authService.getUser();
        this.eventListRef = firebase.firestore().collection(`userProfile/${user.uid}/eventList`);
        return this.eventListRef.doc(eventId).delete();
    }

    async updateEvent(eventId: string, updatedEvent: Event): Promise<void> {
        const user: firebase.User = await this.authService.getUser();
        this.eventListRef = firebase.firestore().collection(`userProfile/${user.uid}/eventList`);
        updatedEvent.price = updatedEvent.price * 1;
        updatedEvent.cost = updatedEvent.cost * 1;
        updatedEvent.revenue = updatedEvent.cost * -1;
        return this.eventListRef.doc(eventId).update(updatedEvent);
    }

    async deleteGuest(eventId: string, guestId: string): Promise<void> {
        const user: firebase.User = await this.authService.getUser();
        const guestList = firebase.firestore().collection(`userProfile/${user.uid}/eventList/${eventId}/guestList`);
        return guestList.doc(guestId).delete();
    }

    async updateGuest(eventId: string, guest: Guest): Promise<void> {
        const user: firebase.User = await this.authService.getUser();
        const guestList = firebase.firestore().collection(`userProfile/${user.uid}/eventList/${eventId}/guestList`);
        return guestList.doc(guest.id).update(guest);
    }

}
