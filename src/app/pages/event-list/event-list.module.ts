import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EventListPageRoutingModule } from './event-list-routing.module';

import { EventListPage } from './event-list.page';

import { EventModalComponent } from '../../modals/event-modal/event-modal.component';

import { EventModule } from '../../shared-modules/event.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EventListPageRoutingModule,
    EventModule
  ],
  declarations: [EventListPage, EventModalComponent],
  entryComponents: [EventModalComponent]
})
export class EventListPageModule {}
