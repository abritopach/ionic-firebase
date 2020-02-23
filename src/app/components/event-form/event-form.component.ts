import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';

import { Event } from '../../models/event';

@Component({
    selector: 'app-event-form',
    templateUrl: './event-form.component.html',
    styleUrls: ['./event-form.component.scss'],
})
export class EventFormComponent implements OnInit {

    eventForm: FormGroup;

    @Input() actionButtonText: string;
    @Input() isEditMode: boolean;
    @Input() event: Event;
    @Output() formSubmitted = new EventEmitter<Event>();

    constructor(private formBuilder: FormBuilder) {
        this.createForm();
    }

    ngOnInit() {
        console.log('isEditMode', this.isEditMode);
        if (this.isEditMode) {
            this.eventForm.patchValue(this.event);
        }
    }

    createForm() {
        this.eventForm = this.formBuilder.group({
            name: ['', Validators.required],
            price: ['', Validators.required],
            cost: ['', Validators.required],
            date: ['', Validators.required],
            revenue: 0
        });
    }

    submitEvent(eventForm: FormGroup): void {
        if (!eventForm.valid) {
            console.log('Form is not valid yet, current value:', eventForm.value);
        } else {
            console.log(eventForm.value);
            this.formSubmitted.emit(eventForm.value as Event);
        }
    }

}
