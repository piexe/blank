import { Component,ViewChild,ElementRef } from '@angular/core';
import { NavController,AlertController } from 'ionic-angular';

import { Geolocation,GeolocationOptions,Geoposition,PositionError  } from "@ionic-native/geolocation";

declare var google;

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  @ViewChild("map") mapElement : ElementRef;
  private options : GeolocationOptions;
  private currentPos : Geoposition;
  private userLat : any; // 사용자 위도
  private userLong : any; // 사용자 경도
  private map : any;

  constructor(public navCtrl: NavController,
    private alertCtrl: AlertController,
    private geolocation : Geolocation){

    }
    ionViewDidEnter(){
      this.getUserPosition();
    }
    getUserPosition(){
      this.options = {
        enableHighAccuracy : false
      };

    this.geolocation.getCurrentPosition(this.options).then((pos : Geoposition) =>{
      this.currentPos = pos;
      console.log(pos);

      this.userLat = pos.coords.latitude;
      this.userLong = pos.coords.longitude;

      this.addMap(pos.coords.latitude,pos.coords.longitude);
    },(err : PositionError) =>{
      console.log("error : " + err.message)
    })

    }


    addMap(lat,long){

      let latLng = new google.maps.LatLng(lat.long);

      let mapOptions = {
        center : latLng,
        zoom : 15,
        mapTypeId : google.maps.MapTypeId.ROADMAP 
      }

    this.map = new google.maps.Map(this.mapElement.nativeElement,mapOptions);
   
    this.addMarker();
    }

    addMarker() {
      var userMarker = "assets/imgs/Map_pin_icon.svg.png";
      let marker = new google.maps.Marker({
        map : this.map,
        animation : google.maps.Animation.DROP,
        position : this.map.getCenter(),
        icon : userMarker
      });

      google.maps.event.addListener(marker,"click",() => {
       let messages = "latitude :" + this.userLat + "<br>Longtiude : " + this.userLong;
        let alert = this.alertCtrl.create({
          title: 'New Position',
          message : messages ,
          buttons: ['OK']
        });
        alert.present();

      });
    
    }
  }

