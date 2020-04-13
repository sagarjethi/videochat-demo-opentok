import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import * as OT from '@opentok/client';
//declare var OT:any;
import { AndroidPermissions } from '@ionic-native/android-permissions';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  session: any;
  publisher: any;
  apiKey: any;
  sessionId: string;
  token: string;

  constructor(public navCtrl: NavController,private androidPermissions: AndroidPermissions) {
    this.apiKey = "46667812";
    this.sessionId = "1_MX40NjY2NzgxMn5-MTU4NjU1MzE5ODc1N35sS05BalBxVlRQM2dISDRlanFodG9VK0R-UH4";
    this.token = "T1==cGFydG5lcl9pZD00NjY2NzgxMiZzaWc9MDZjNzA3ZmMyNDE3NzM5YmUyMmRhY2Y3MzY0YWI2Mjg1NWYxNWUwNDpzZXNzaW9uX2lkPTFfTVg0ME5qWTJOemd4TW41LU1UVTROalUxTXpFNU9EYzFOMzVzUzA1QmFsQnhWbFJRTTJkSVNEUmxhbkZvZEc5VkswUi1VSDQmY3JlYXRlX3RpbWU9MTU4NjU1MzIyOSZub25jZT0wLjE3MDM3MjM0NjQxNDgzNDEyJnJvbGU9cHVibGlzaGVyJmV4cGlyZV90aW1lPTE1ODY2Mzk2MjgmaW5pdGlhbF9sYXlvdXRfY2xhc3NfbGlzdD0=";
  }

  startCall(apiKey,sessionId,token) {
    this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.CAMERA).then(
      result => {
     console.log('Has permission?',result.hasPermission)
     if(result.hasPermission){
     this.session = OT.initSession(apiKey, sessionId);
   // this.publisher = OT.initPublisher('publisher');
    let publisherOptions = {
      publishAudio: true,
      publishVideo: true,
      name: "videoCam",
      width: "350px",
      height: "350px"         
   };
  
    this.publisher = OT.initPublisher("publisher", publisherOptions, (error) => {
      if (error) {
        console.log("Webcam Publisher ERROR.", error);
     
      } else {
        console.log("Webcam Publisher initialized.");
       }
    }
    );
    this.session.on({
      streamCreated: (event: any) => {
        this.session.subscribe(event.stream, 'subscriber');
       // OT.publishVideo();
      },
      streamDestroyed: (event: any) => {
        console.log(`Stream ${event.stream.name} ended because ${event.reason}`);
       // OT.publishVideo();        
      },
      sessionConnected: (event: any) => {
        this.session.publish(this.publisher);
      }
    });

    this.session.connect(token, (error: any) => {
      if (error) {
        console.log(`There was an error connecting to the session ${error}`);
      }
    });
  } else{
    this.androidPermissions.requestPermissions([this.androidPermissions.PERMISSION.CAMERA,this.androidPermissions.PERMISSION.RECORD_AUDIO,this.androidPermissions.PERMISSION.WAKE_LOCK,this.androidPermissions.PERMISSION.MODIFY_AUDIO_SETTINGS,this.androidPermissions.PERMISSION.CALL_PHONE])
  }
    },
      err => this.androidPermissions.requestPermissions([
        this.androidPermissions.PERMISSION.CAMERA,
        this.androidPermissions.PERMISSION.RECORD_AUDIO,
        this.androidPermissions.PERMISSION.WAKE_LOCK,
        this.androidPermissions.PERMISSION.CALL_PHONE,
        this.androidPermissions.PERMISSION.MODIFY_AUDIO_SETTINGS])
    );
    
  }

}
