import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { MatPaginatorIntl } from '@angular/material/paginator';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthComponent } from './auth/auth.component';
import { authInterceptor } from './auth/interceptors/auth-interceptor';
import { HomeComponent } from './home/home.component';
import { MainModule } from './main/main.module';
import { MatPaginatorIntlPtBr } from './shared/helpers/TranslatePaginator';

@NgModule({
  declarations: [AppComponent, AuthComponent, HomeComponent],
  imports: [BrowserModule, AppRoutingModule, MainModule],
  providers: [
    provideHttpClient(withInterceptors([authInterceptor])),
    provideAnimationsAsync(),
    { provide: MatPaginatorIntl, useClass: MatPaginatorIntlPtBr },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
