import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { getAuth, provideAuth } from '@angular/fire/auth';
import { AngularFireModule } from '@angular/fire/compat';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getDatabase, provideDatabase } from '@angular/fire/database';
import { getFunctions, provideFunctions } from '@angular/fire/functions';
import { getMessaging, getToken, provideMessaging } from '@angular/fire/messaging';
import { getStorage, provideStorage } from '@angular/fire/storage';
import { AngularFireMessagingModule } from '@angular/fire/compat/messaging';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeModule } from './components/home/home.module';
import { GeneralModule } from './components/general/general.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
// import { AnimateOnScrollModule } from 'ng2-animate-on-scroll';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { NgxGoogleAnalyticsModule } from 'ngx-google-analytics';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import {
  TranslateLoader,
  TranslateModule,
  TranslateService,
} from '@ngx-translate/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { AddProjectComponent } from './components/add-project/add-project.component';
import { LoaderComponent } from './components/loader/loader.component';
// import { LoaderComponent } from './components/loader/loader.component';
// import { SharedModule } from './shared/shared.module';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    AppComponent,
    AddProjectComponent,
    LoaderComponent,

    /* ArchiveComponent */
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    FormsModule,
    NgbModule,
    HomeModule,
    GeneralModule,

    // AnimateOnScrollModule.forRoot(),

    AngularFireModule.initializeApp(environment.firebaseConfig),
    // provideFirebaseApp(() => initializeApp({"projectId":"pub-partner-55723","appId":"1:445280387602:web:c702d6f68e4c84bd7fcecb","storageBucket":"pub-partner-55723.appspot.com","apiKey":"AIzaSyDN9qgiif4KIwD9FcQtWYVYmrcCALOR0Ko","authDomain":"pub-partner-55723.firebaseapp.com","messagingSenderId":"445280387602","measurementId":"G-9T6K5H0HRC"})), 
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    provideDatabase(() => getDatabase()),
    provideFunctions(() => getFunctions()),
    provideMessaging(() => getMessaging()),
    provideStorage(() => getStorage()),
    
    AngularFireMessagingModule,
    AppRoutingModule,
    HttpClientModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
    }),
    // NgxGoogleAnalyticsModule.forRoot(environment.trackAnalyticID),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    }),
    // provideFirebaseApp(() => initializeApp({"projectId":"developer-detail","appId":"1:576873905086:web:e3685595c4db0b40b997ef","storageBucket":"developer-detail.appspot.com","apiKey":"AIzaSyB0glaxlCfUmAu3UNNyLVqdmIfe8JN7pv8","authDomain":"developer-detail.firebaseapp.com","messagingSenderId":"576873905086"})),
  ],
  providers: [TranslateService],
  bootstrap: [AppComponent],
})
export class AppModule {}
