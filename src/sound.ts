import * as BABYLON from '@babylonjs/core';
import {GameEvents,GameEvent} from './game_events';
import {GameState, ManiMenu} from './main_menu';

export class GameSound {
    bg_sound: BABYLON.Sound;
    match_sound:BABYLON.Sound;
    loadCompleted:boolean=false;
    constructor(scene:BABYLON.Scene){
        this.bg_sound = new BABYLON.Sound("gbSound", "./assets/texture/bg_music.wav", scene, 
                ()=>{
                    // Sound has been downloaded & decoded
                    //music.play();
                    ManiMenu.onMuteSoundObservable.add((evt:GameState)=>{this.stopBgMusic()});
                    ManiMenu.onResumeSoundObservable.add((evt:GameState)=>{this.playBgMusic()});
                    this.playBgMusic();
                }
        ,{loop: true});
        this.match_sound = new BABYLON.Sound("Violons", "./assets/texture/match.wav", scene, 
                ()=>{
                    this.loadCompleted=true;
                    GameEvents.OnMatchFoundObservable.add((evt:GameEvent)=>{this.playMatchFoundSound()});
                }
        );
    }
    stopBgMusic(){
        this.bg_sound.stop();
    }
    playBgMusic(){
        this.bg_sound.play();
    }
    playMatchFoundSound(){
        this.match_sound.play();
    }
}