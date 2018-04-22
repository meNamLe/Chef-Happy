import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform, ModalController } from 'ionic-angular';
import { ClarifaiService } from '../../services/clarifai.service';
import { CameraPreview, CameraPreviewPictureOptions } from '@ionic-native/camera-preview';

import { HomePage } from '../home/home';
import { RecipePage } from '../recipe/recipe';
import { Http } from '@angular/http';

@IonicPage()
@Component({
  selector: 'page-camera',
  templateUrl: 'camera.html',
})
export class CameraPage {
  base64Image;
  pictureOpts: CameraPreviewPictureOptions = {
    width: 1440,
    height: 1920,
    quality: 72
  }
  imgUrl: string;
  // clarifai obj response food tags 
  clarifaiObj;
  // the hook up
  recipes = [];
  //default classes to make ngClass work
  default: boolean = true;

  tagView: string;

  //bools
  shouldAnimate: boolean = false;
  //takes picture and clarifai responds
  shouldShowTags: boolean = false;
  //circle jerk
  shouldCircle: boolean = false;
  shouldTick: boolean = false;

  resetBool: boolean = false;
  fryOpacity = [false,false,false,false,false,false,false,false,false,false];

  constructor(private platform: Platform,
              public navCtrl: NavController, 
              private clarifai: ClarifaiService, 
              private cameraPreview: CameraPreview, 
              private modalCtrl: ModalController,
              private http: Http) {
    platform.ready().then(()=> {
      let options = {
        x: 0,
        y: 0,
        width: window.screen.width,
        height: window.screen.height,
        camera: 'rear',
        tapPhoto: true,
        previewDrag: true,
        toBack: true,
      }
      this.cameraPreview.startCamera(options).then(
        (res)=> {
          console.log(res)
        },
        (err) => {
          console.log(err)
        });

        let modal = modalCtrl.create(HomePage ,{callback: this.myCallbackFunction});
        modal.present();
    });
  }

    // callback...
    myCallbackFunction = (_params) => {
      return new Promise((resolve, reject) => {
              console.log(_params);
              this.shouldAnimate = _params;
              this.shouldTick = true;
              this.shouldCircle = true;
              resolve();
            });
    }

  //cameraPreview capture picture function
  async takePicture(){
    // take a picture
    await this.cameraPreview.takePicture(this.pictureOpts).then(async (imageData) => {
      this.base64Image = ('data:image/jpeg;base64,' + imageData);
      console.log(this.base64Image.replace(/^data:image\/(.*);base64,/, ''));
      this.imgUrl = this.base64Image.replace(/^data:image\/(.*);base64,/, '');
    }, (err) => {
      console.log(err);
    });
    console.log('image');
    console.log(this.imgUrl)
    console.log('picture captured');
  }

  resetCallback = (_params) => {
    return new Promise((resolve, reject) => {
            this.imgUrl = ''
            // clarifai obj response food tags 
            this.clarifaiObj = {};
            // the hook up
            this.recipes = [];
          
            this.tagView = '';
          
            //bools
            this.shouldAnimate = false;
            //takes picture and clarifai responds
            this.shouldShowTags = false;
            //circle jerk
            this.shouldCircle = false;
            this.shouldTick = false;
          
            this.resetBool = false;   
            this.fryOpacity = [false,false,false,false,false,false,false,false,false,false];         
            let modal = this.modalCtrl.create(HomePage ,{callback: this.myCallbackFunction});
            resolve();
            modal.present();
          });
  }

  clearClarifai(){
    this.clarifaiObj = this.clarifai.foodPredict(this.imgUrl);
  }

  results = async () => {
    await this.takePicture();

    this.clarifaiObj = await this.clarifai.foodPredict(this.imgUrl);
    console.log(this.clarifaiObj)
    //clarifai api call
    this.shouldAnimate = false;
    this.shouldCircle = false;
    this.timeout(0);

    //big oven api call
    await this.bigOven(); 
    /* await this.bigOven(); */
    setTimeout(() => this.navCtrl.push(RecipePage, {recipes: this.recipes, resetCallback: this.resetCallback, ing: this.clarifaiObj.foodResponse}), 16000); 
  }

  timeout(count: number){
    setTimeout(() => {
        console.log(this.clarifaiObj);
        this.tagView = this.clarifaiObj.foodResponse[count].name;
        this.shouldShowTags = true;
        this.fryOpacity[count] = true;
        count++;
        if(count != 10){
          this.timeout(count);
        }
        else {
          this.shouldShowTags = false;
          this.tagView = '';
        }
    }, 1500);
  }


  bigOven = () => {
    let api_key = 'SUBSCRIPTIONKEY'
    let clarifaiStr = this.clarifaiObj.foodString;
    /* this.http.get(`https://api2.bigoven.com/recipes?include_ing=${foodString}&api_key=${api_key}`) */
    this.http.get(`https://api2.bigoven.com/recipes?include_ing=${clarifaiStr}&api_key=${api_key}`) 
    .map((data) => {
      console.log(data);
      console.log(JSON.parse(data["_body"]).Results)
      this.recipes = JSON.parse(data["_body"]).Results;
    })
    .subscribe(
        data => {
          console.log('success!')
        },
        err => {
            console.log("Oops!");
        }
    );
    console.log('recipes: ')
    console.log(this.recipes)

  }
}
