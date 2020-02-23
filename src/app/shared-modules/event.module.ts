import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EventFormComponent } from '../components/event-form/event-form.component';

@NgModule({
  declarations: [EventFormComponent],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule
  ],
  exports: [EventFormComponent],
  entryComponents: [EventFormComponent]
})
export class EventModule { }