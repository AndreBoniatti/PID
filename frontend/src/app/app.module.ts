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

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthComponent } from './auth/auth.component';
import { authInterceptor } from './auth/interceptors/auth-interceptor';
import { HomeComponent } from './home/home.component';
import { MainModule } from './main/main.module';
import { MatPaginatorIntlPtBr } from './shared/helpers/TranslatePaginator';
import { PeriodResumeComponent } from './home/period-resume/period-resume.component';

@NgModule({
  declarations: [
    AppComponent,
    AuthComponent,
    HomeComponent,
    PeriodResumeComponent,
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
  ],
  providers: [
    provideHttpClient(withInterceptors([authInterceptor])),
    provideAnimationsAsync(),
    { provide: MatPaginatorIntl, useClass: MatPaginatorIntlPtBr },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
