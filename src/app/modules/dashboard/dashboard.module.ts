import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { DashboardPageRoutingModule } from './dashboard-routing.module';
import { DashboardPage } from './dashboard.page';
import { BusinessItemComponent } from './components/business-item/business-item.component';
import { OrderByPipe } from 'src/app/shared/pipes/order-by.pipe';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DashboardPageRoutingModule,
    BusinessItemComponent,
    OrderByPipe,
    TranslateModule
  ],
  declarations: [DashboardPage],
})
export class DashboardPageModule {}
