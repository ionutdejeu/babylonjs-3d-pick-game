import { GameUtils } from './game-utils';
import * as BABYLON from '@babylonjs/core';
import * as GUI from '@babylonjs/gui';
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
    private _meshInstanceCollection:Array<BABYLON.InstancedMesh> = [];

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
        const box = BABYLON.BoxBuilder.CreateBox('cube', { size: 3 }, scene)
        
        let colorData = new Float32Array(4 * positions.length);
        let uvData = new Float32Array(2* positions.length)

        for (var index = 0; index < positions.length; index++) {
                colorData[index * 4] = Math.random();
                colorData[index * 4 + 1] = Math.random();
                colorData[index * 4 + 2] = Math.random();
                colorData[index * 4 + 3] = 1.0;
        }
        console.log(box.getVerticesData(BABYLON.VertexBuffer.UVKind));

        for(var index = 0;index<=positions.length;index++){
            uvData[index*2] = 0;
            uvData[index*2+1] = 16;
        }
        
        var buffer = new BABYLON.VertexBuffer(scene.getEngine(), colorData, BABYLON.VertexBuffer.ColorKind, false, false, 4, true);
        box.setVerticesBuffer(buffer);
        var uvBuffer = new BABYLON.VertexBuffer(scene.getEngine(),uvData,BABYLON.VertexBuffer.UVKind,false,false,2,true);
        box.setVerticesData(BABYLON.VertexBuffer.UVKind,uvData,false);
        //box.updateVerticesData(BABYLON.VertexBuffer.UVKind,uvData,false,true);
        console.log(box.getVerticesData(BABYLON.VertexBuffer.UVKind));

        let mat =  GameUtils.createMinecraftBlockMaterial(this._scene);
        mat.emissiveColor = BABYLON.Color3.White();
        box.material = mat;


        for(let dir=0;dir<positions.length;dir++){
            let instance = box.createInstance("box" + dir);
            instance.position = positions[dir].scale(40);
            instance.alwaysSelectAsActiveMesh = true;
            instance.freezeWorldMatrix();
            instance.actionManager = new BABYLON.ActionManager(scene);
            instance.actionManager.registerAction(
                new BABYLON.ExecuteCodeAction(
                    BABYLON.ActionManager.OnPickTrigger, function(bjsevt) {
                        console.log(bjsevt);
                    }
                )
            )
            this._meshInstanceCollection.push(instance);
        }

        //box.isVisible = false;
    }
}