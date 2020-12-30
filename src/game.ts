import { GameUtils } from './game-utils';
import * as BABYLON from '@babylonjs/core';
import * as GUI from '@babylonjs/gui';
import {GameEvent,GameEvents} from './game_events'
import {GameCubeMatch} from './matching';
import '@babylonjs/inspector';

export class Game {

    private _canvas: HTMLCanvasElement;
    private _engine: BABYLON.Engine;
    private _scene: BABYLON.Scene;
    private _camera: BABYLON.ArcRotateCamera;
    private _light: BABYLON.Light;
    private _sharkMesh: BABYLON.AbstractMesh;
    private _sharkAnimationTime = 0;
    private _swim: boolean = false;
    private _numViewDirections:number= 300;
    private _directions:Array<BABYLON.Vector3> = [];
    private _meshInstanceCollection:Array<BABYLON.Mesh> = [];
    private _matchingLogic:GameCubeMatch;
    constructor(canvasElement: string) {
        // Create canvas and engine
        this._canvas = <HTMLCanvasElement>document.getElementById(canvasElement);
        this._engine = new BABYLON.Engine(this._canvas, true);
    }

    /**
     * Creates the BABYLONJS Scene
     */
    createScene(): void {
        // create a basic BJS Scene object
        this._scene = new BABYLON.Scene(this._engine);

        // show the inspector when pressing shift + alt + I
        this._scene.onKeyboardObservable.add(({ event }) => {
            if (event.ctrlKey && event.shiftKey && event.code === 'KeyI') {
                if (this._scene.debugLayer.isVisible()) {
                    this._scene.debugLayer.hide()
                } else {
                    this._scene.debugLayer.show()
                }
            }
        })
        // create a FreeCamera, and set its position to (x:0, y:5, z:-10)
        this._camera = new BABYLON.ArcRotateCamera("Camera", 3 * Math.PI / 2, Math.PI / 4, 30, BABYLON.Vector3.Zero(), this._scene);
        this._camera.attachControl(this._canvas, true);
        // create a basic light, aiming 0,1,0 - meaning, to the sky
        this._light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), this._scene);
        // create the skybox
        let skybox = GameUtils.createSkybox("skybox", "./assets/texture/skybox/TropicalSunnyDay", this._scene);
        // creates the sandy ground
        this.computeBlocsPositionOnSphere();
        this.createCubes(this._scene,this._directions);
        this._matchingLogic = new GameCubeMatch(this._scene);
        // Physics engine also works
        let gravity = new BABYLON.Vector3(0, -0.9, 0);
        this._scene.enablePhysics(gravity, new BABYLON.CannonJSPlugin());
    }


    /**
     * Starts the animation loop.
     */
    animate(): void {
       

        // run the render loop
        this._engine.runRenderLoop(() => {
            this._scene.render();
        });

        // the canvas/window resize event handler
        window.addEventListener('resize', () => {
            this._engine.resize();
        });
    }

     
    computeBlocsPositionOnSphere = ()=>{
    
        let goldenRatio:number = (1 + Math.sqrt(5)) / 2;
        let angleIncrement: number = Math.PI * 2 * goldenRatio;
    
        for (let i = 0; i < this._numViewDirections; i++) {
            let t = i / this._numViewDirections;
            let inclination = Math.acos (1 - 2 * t);
            let azimuth = angleIncrement * i;

            let x = Math.sin (inclination) * Math.cos (azimuth);
            let y = Math.sin (inclination) * Math.sin (azimuth);
            let z = Math.cos (inclination);
            this._directions[i] = new BABYLON.Vector3 (x, y, z);
        }
    }
    

    createCubes(scene:BABYLON.Scene, positions:Array<BABYLON.Vector3>){
        const box = BABYLON.BoxBuilder.CreateBox('cube',{ size: 3 }, scene)
       
        let mat =  GameUtils.createMinecraftBlockMaterial(this._scene);
        box.material = mat;
        

        let positionsCopy = Object.assign([], positions);
        for(let dir=0;dir<positionsCopy.length;dir++){
            
            let c = new BABYLON.Color3();
            c.r = Math.random();
            c.g = Math.random();
            c.b = Math.random();

            for (let i = 0; i < 2; i++) {
                const randIndex = parseInt(String(Math.random()*positionsCopy.length));
                let instance = BABYLON.BoxBuilder.CreateBox('cube'+String(dir)+String(i),{ size: 3 }, scene)
                instance.position = positionsCopy[randIndex].scale(40);
                instance.alwaysSelectAsActiveMesh = true;

                instance.freezeWorldMatrix();
                instance.actionManager = new BABYLON.ActionManager(scene);
                instance.material = GameUtils.getBoxDynamicTextureWithColor(scene,dir,c);
                instance.metadata = {value:dir};
                
                instance.actionManager.registerAction(
                    new BABYLON.ExecuteCodeAction(
                        BABYLON.ActionManager.OnPickTrigger, function(bjsevt) {
                            console.log(bjsevt);
                            let m = bjsevt.source as BABYLON.Mesh;
                            GameEvents.SelectionObservable.notifyObservers(new GameEvent(this._scene,this._camera,m));
                        }
                    )
                )
                this._meshInstanceCollection.push(instance);
                positionsCopy.splice(randIndex, 1); 
            }
            
        }
    }

    draIndeces(scene:BABYLON.Scene,positionData:Float32Array,uvData:Array<Number>){
        for (let i = 0; i < positionData.length; i+=3) {
            const verPos = new BABYLON.Vector3(positionData[i],positionData[i+1],positionData[i+2]).scale(1+i*0.02);
            let lbl = parseInt((i/9).toString()) + ":"+ uvData[i/3] + ','+uvData[i/3+1];
            console.log(lbl);
            this.makeLabel(scene,lbl,"black",verPos);
        }

    }
    makeLabel(scene:BABYLON.Scene,text:string, color:string,position:BABYLON.Vector3) {
        //Set font type
        var font_type = "Arial";
        
        //Set width an height for plane
        var planeWidth = 0.5;
        var planeHeight = 0.5;
        var DTWidth = planeWidth * 60;
        var DTHeight = planeHeight * 60;
        var dynamicTexture = new BABYLON.DynamicTexture("DynamicTexture",{width:DTWidth, height:DTHeight}, scene, true);
            //Check width of text for given font type at any size of font
        var ctx = dynamicTexture.getContext();
        var size = 12; //any value will work
        ctx.font = size + "px " + font_type;
        var textWidth = ctx.measureText(text).width;
        
        //Calculate ratio of text width to size of font used
        var ratio = textWidth/size;
        
        //set font to be actually used to write text on dynamic texture
        var font_size = Math.floor(DTWidth / (ratio * 1)); //size of multiplier (1) can be adjusted, increase for smaller text
        var font = font_size + "px " + font_type;
        
        //Draw text
        dynamicTexture.drawText(text, null, null, font, "#000000", "#ffffff", true);

    	var plane = BABYLON.MeshBuilder.CreatePlane("TextPlane", {width:planeWidth, height:planeHeight}, scene);
    	let mat = new BABYLON.StandardMaterial("TextPlaneMaterial", scene);
    	mat.backFaceCulling = false;
    	//mat.diffuseColor = new BABYLON.Color3(0, 0, 0);
        mat.diffuseTexture = dynamicTexture;
        plane.position = position;
        plane.material = mat;
        plane.showBoundingBox = true;

    	return plane;
     }
}