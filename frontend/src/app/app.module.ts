import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { HammerModule } from '@angular/platform-browser';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import {MatToolbarModule} from '@angular/material/toolbar';
import { AppComponent } from './app.component';
import { CandidateComponent } from './candidate/candidate.component';
import { CandidateService } from './candidate.service';
import { HomeComponent } from './home/home.component';
import { AppRoutingModule } from './app-routing.module';

@NgModule({
  declarations: [
    AppComponent,
    CandidateComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    MatSidenavModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatCardModule,
    MatButtonModule,
    HammerModule,
    MatIconModule,
    AppRoutingModule,
    MatToolbarModule
  ],
  providers: [CandidateService],
  bootstrap: [AppComponent]
})
export class AppModule { }
