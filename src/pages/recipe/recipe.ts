import { Component, ViewChild, ViewChildren, QueryList } from '@angular/core';
import { NavController, NavParams, ModalController } from 'ionic-angular';
import { Http } from '@angular/http';
import 'rxjs/Rx';
 
import {
  StackConfig,
  Stack,
  Card,
  ThrowEvent,
  DragEvent,
  SwingStackComponent,
  SwingCardComponent} from 'angular2-swing';
import { ListPage } from '../list/list';

  @Component({
    selector: 'page-recipe',
    templateUrl: 'recipe.html',
  })
 
export class RecipePage {
  @ViewChild('myswing1') swingStack: SwingStackComponent;
  @ViewChildren('mycards1') swingCards: QueryList<SwingCardComponent>;
  
  cards: Array<any>;
  stackConfig: StackConfig;
  // Big Oven response into Array
  recipesArr = []
  //recipe on view
  recipe = [];
  count = 0;
  
  constructor(private http: Http,
              private params: NavParams,
              private modalCtrl: ModalController,
              private navCtrl: NavController) {
    this.stackConfig = {
      throwOutConfidence: (offsetX, offsetY, element) => {
        return Math.min(Math.abs(offsetX) / (element.offsetWidth/2), 1);
      },
      transform: (element, x, y, r) => {
        this.onItemMove(element, x, y, r);
      },
      throwOutDistance: (d) => {
        return 800;
      }
    };
  }
  
  ngAfterViewInit() {
    //params recipes
    this.recipesArr = this.params.get("recipes")
    this.recipe[0] = this.recipesArr[0];
    console.log(this.recipesArr);

    // Either subscribe in controller or set in HTML
    this.swingStack.throwin.subscribe((event: DragEvent) => {
      event.target.style.background = '#ffffff';
    });
    
    this.cards = [{email: ''}];
    this.addNewCards(1);
  }

  
  // Called whenever we drag an element
  onItemMove(element, x, y, r) {
    var color = '';
    var abs = Math.abs(x);
    let min = Math.trunc(Math.min(16*16 - abs, 16*16));
    let hexCode = this.decimalToHex(min, 2);
    
    if (x < 0) {
      color = '#FF' + hexCode + hexCode;
    } else {
      color = '#' + hexCode + 'FF' + hexCode;
    }
    
    element.style.background = color;
    element.style['transform'] = `translate3d(0, 0, 0) translate(${x}px, ${y}px) rotate(${r}deg)`;
  }
 
  // Connected through HTML
  voteUp(like: boolean) {
    let removedCard = this.recipe.pop();
    this.addNewCards(1);
  }
  
  // Add new cards to our array
  addNewCards(count: number) {
    this.count++;
    this.recipe[0] = this.recipesArr[this.count];
  }
  
  // http://stackoverflow.com/questions/57803/how-to-convert-decimal-to-hex-in-javascript
  decimalToHex(d, padding) {
    var hex = Number(d).toString(16);
    padding = typeof (padding) === "undefined" || padding === null ? padding = 2 : padding;
    
    while (hex.length < padding) {
      hex = "0" + hex;
    }
    
    return hex;
  }

  viewList(){
    let obj = this.params.get('ing');
    let modal = this.modalCtrl.create(ListPage, {ing: obj});
    modal.present(); 
  }

  reset(){
    let callback = this.params.get("resetCallback");

    callback(true).then(()=>{
    this.navCtrl.pop();
    })
  }
}