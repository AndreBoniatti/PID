import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatDialogModule } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatToolbarModule } from '@angular/material/toolbar';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthComponent } from './auth/auth.component';
import { authInterceptor } from './auth/interceptors/auth-interceptor';
import { HomeComponent } from './home/home.component';
import { MainModule } from './main/main.module';
import { MatPaginatorIntlPtBr } from './shared/helpers/TranslatePaginator';
import { PeriodResumeComponent } from './home/period-resume/period-resume.component';
import { AggregatedPlansReportComponent } from './home/aggregated-plans-report/aggregated-plans-report.component';

@NgModule({
  declarations: [
    AppComponent,
    AuthComponent,
    HomeComponent,
    PeriodResumeComponent,
    AggregatedPlansReportComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MainModule,
    MatExpansionModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatPaginatorModule,
    MatDialogModule,
    FormsModule,
    MatSelectModule,
    MatToolbarModule,
  ],
  providers: [
    provideHttpClient(withInterceptors([authInterceptor])),
    provideAnimationsAsync(),
    { provide: MatPaginatorIntl, useClass: MatPaginatorIntlPtBr },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
