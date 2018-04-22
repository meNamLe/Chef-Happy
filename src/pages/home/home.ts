import { Component } from '@angular/core';
import { NavParams, NavController } from 'ionic-angular';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  callback = this.navParams.get("callback");
  enterBool = false;
  default = true;
  constructor(private navParams: NavParams, private navCtrl: NavController) {

  }
  enter(){
    console.log('here');
    this.enterBool = true;

    setTimeout(() => {
        this.callback(true).then(()=>{
        this.navCtrl.pop();
      });  
    }, 2000);

  }
}
