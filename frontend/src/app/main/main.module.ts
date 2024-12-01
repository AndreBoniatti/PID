import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';

import { MainRoutingModule } from './main-routing.module';
import { MainComponent } from './main.component';
import { PeriodComponent } from './period/period.component';

@NgModule({
  declarations: [MainComponent, PeriodComponent],
  imports: [
    CommonModule,
    MainRoutingModule,
    MatIconModule,
    MatButtonModule,
    MatToolbarModule,
  ],
})
export class MainModule {}
