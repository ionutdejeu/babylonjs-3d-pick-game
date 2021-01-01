import * as BABYLON from '@babylonjs/core';
import * as GUI from '@babylonjs/gui';
import { GameEvent, GameEvents } from './game_events';
import { GameSound } from './sound';

export class GameState {

}

export class ManiMenu {
    static _instance:ManiMenu;
    public static gameStarted:boolean=false; 
    public menuStateVisible:boolean=true;
    public playingBgSound:boolean=true;
    public static onMuteSoundObservable:BABYLON.Observable<GameState> = new BABYLON.Observable<GameState>();
    public static onResumeSoundObservable:BABYLON.Observable<GameState> = new BABYLON.Observable<GameState>();
    
    public static get instance() : ManiMenu {
        return this._instance;
    }
    
    uiGrid:GUI.Grid;
    inGameUIGrid:GUI.Grid;
    menuCtrl:GUI.AdvancedDynamicTexture;
    showMenuButton:GUI.Button;
    menuButtonPlay:GUI.Button;
    menuOptionsBtn:GUI.Button;
    restartBtn:GUI.Button;
    private _scene: BABYLON.Scene;
    constructor(scene:BABYLON.Scene){
        this.createMenu(scene);
        this._scene = scene;
        ManiMenu._instance = this;

    }
    createMenu(scene:BABYLON.Scene){

        this.uiGrid = new GUI.Grid();   
        this.uiGrid.addColumnDefinition(0.5);
        this.uiGrid.addColumnDefinition(300,true);
        this.uiGrid.addColumnDefinition(0.5);
        this.uiGrid.addRowDefinition(0.5);
        this.uiGrid.addRowDefinition(100,true);
        this.uiGrid.addRowDefinition(100,true);
        this.uiGrid.addRowDefinition(100,true);
        this.uiGrid.addRowDefinition(100,true);
        this.uiGrid.addRowDefinition(100,true);
        this.uiGrid.addRowDefinition(0.5);


        this.inGameUIGrid = new GUI.Grid();

        this.inGameUIGrid.addColumnDefinition(.9);
        this.inGameUIGrid.addColumnDefinition(100,true);
        this.inGameUIGrid.addRowDefinition(100,true);
        this.inGameUIGrid.addRowDefinition(.9);

        this.menuCtrl = GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI",true,scene);
        
        this.showMenuButton = this.createButton("showMenuButton", "M");

        this.menuButtonPlay = this.createButton("startGameButton", "Start Game");
        this.menuOptionsBtn = this.createButton("optionsBtn", "Mute music");
        this.restartBtn = this.createButton("restartBtn", "Restart level");
    
        this.menuCtrl.addControl(this.uiGrid);
        this.uiGrid.addControl(this.menuOptionsBtn,1,1);
        this.uiGrid.addControl(this.menuButtonPlay,2,1);
        this.uiGrid.addControl(this.restartBtn,3,1);
        this.menuCtrl.addControl(this.inGameUIGrid);
        this.inGameUIGrid.addControl(this.showMenuButton,0,1);
        this.inGameUIGrid.isVisible = false;

        this.menuOptionsBtn.onPointerDownObservable.add((evt:GUI.Vector2WithInfo,evtData:BABYLON.EventState)=>{
            this.toggleSound()
        });

        this.menuButtonPlay.onPointerDownObservable.add((evt:GUI.Vector2WithInfo,evtData:BABYLON.EventState)=>{
            this.playGame();
        });
        this.restartBtn.onPointerDownObservable.add((evt:GUI.Vector2WithInfo,evtData:BABYLON.EventState)=>{
            this.restartGame();
        });
        this.showMenuButton.onPointerDownObservable.add((evt:GUI.Vector2WithInfo,evtData:BABYLON.EventState)=>{
            this.toggleMenu();
        });
    }
    toggleSound(){
        this.playingBgSound = !this.playingBgSound;
        if(this.playingBgSound){
            ManiMenu.onResumeSoundObservable.notifyObservers(new GameEvent(this._scene,null,null));
            this.menuOptionsBtn.textBlock.text = "Turn music off";
        }
        else{
            ManiMenu.onMuteSoundObservable.notifyObservers(new GameEvent(this._scene,null,null));
            this.menuOptionsBtn.textBlock.text = "Turn music on";

        }

    }
    toggleMenu(){
        this.menuStateVisible = !this.menuStateVisible;
        this.uiGrid.isVisible = this.menuStateVisible;
        this.inGameUIGrid.isVisible = !this.menuStateVisible;
    }
    playGame(){
        this.toggleMenu();
        GameEvents.OnGameResumedObservable.notifyObservers(new GameEvent(this._scene,null,null))
        this.menuButtonPlay.textBlock.text = "Resume";
    }
    restartGame(){
        this.toggleMenu()
        GameEvents.OnGameRestartObservable.notifyObservers(new GameEvent(this._scene,null,null))
    }

    showMenu(){
        this.toggleMenu();
        GameEvents.OnGamePausedObservable.notifyObservers(new GameEvent(this._scene,null,null))
    }

    
    
    createButton(controlName:string,controlTitle:string){
        let btn = GUI.Button.CreateSimpleButton(controlName, controlTitle);
        btn.width =1;
        btn.height =1;
        btn.color = "white";
        btn.paddingBottomInPixels=10;
        btn.background = "blue";
        btn.paddingTopInPixels =10;
        btn.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
        btn.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_TOP;
        return btn;
    }
    
}