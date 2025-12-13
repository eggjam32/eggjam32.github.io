import { Routes } from '@angular/router';
import { AddClient } from './add-client/add-client';
import { ClientListing } from './client-listing/client-listing';
import { EditClient } from './edit-client/edit-client';

export const routes: Routes = [
  { path: '', component: ClientListing, pathMatch: 'full'},
  { path: 'add-client', component: AddClient},
  { path: 'edit-client/:id', component: EditClient}
];
