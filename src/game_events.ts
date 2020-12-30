import * as BABYLON from '@babylonjs/core'

export class GameEvent{
    scene:BABYLON.Scene
    camera:BABYLON.ArcRotateCamera
    source:BABYLON.Mesh
    constructor(
        scene:BABYLON.Scene,
        camera:BABYLON.ArcRotateCamera,
        source:BABYLON.Mesh){
        this.source = source;
        this.scene = scene;
        this.camera = camera;
    }
}
export class GameEvents {
    private static OnMeshSelectedObservable:BABYLON.Observable<GameEvent>;
    private static OnMeshSelectionFailedObservable:BABYLON.Observable<GameEvent>;
    
    public static get SelectionObservable() : BABYLON.Observable<GameEvent> {
        if(GameEvents.OnMeshSelectedObservable === undefined || GameEvents.OnMeshSelectedObservable === null ){
            GameEvents.OnMeshSelectedObservable = new BABYLON.Observable<GameEvent>();
        }
        return GameEvents.OnMeshSelectedObservable;
    }

    public static get SelectionFailedObservable():BABYLON.Observable<GameEvent>{
        if(GameEvents.OnMeshSelectionFailedObservable === undefined || GameEvents.OnMeshSelectionFailedObservable === null ){
            GameEvents.OnMeshSelectionFailedObservable = new BABYLON.Observable<GameEvent>();
        }
        return GameEvents.OnMeshSelectionFailedObservable;
    }
    
} 