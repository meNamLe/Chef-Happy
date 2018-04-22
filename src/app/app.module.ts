import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { CameraPreview } from '@ionic-native/camera-preview'

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { ClarifaiService } from '../services/clarifai.service';
import { CameraPage } from '../pages/camera/camera';
import { RecipePage } from '../pages/recipe/recipe';
import { HttpModule } from '@angular/http';
import { SwingModule } from 'angular2-swing';
import { HTTP } from '@ionic-native/http'
import { ListPage } from '../pages/list/list';


@NgModule({
  declarations: [
    MyApp,
    HomePage,
    CameraPage,
    RecipePage,
    ListPage
  ],
  imports: [
    BrowserModule,
    SwingModule,
    HttpModule,
    IonicModule.forRoot(MyApp),
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    CameraPage,
    RecipePage,
    ListPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    ClarifaiService,
    CameraPreview,
    HTTP
  ]
})
export class AppModule {}
