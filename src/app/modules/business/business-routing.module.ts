import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BusinessPage } from './business.page';

const routes: Routes = [
  {
    path: '',
    component: BusinessPage,
    children: [
      {
        path: 'home',
        loadChildren: () =>
          import('./pages/home/home.module').then(m => m.HomePageModule),
      },
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full',
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BusinessPageRoutingModule {}
