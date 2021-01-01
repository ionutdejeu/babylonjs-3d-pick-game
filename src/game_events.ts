import * as BABYLON from '@babylonjs/core'

export class GameEvent{
    scene:BABYLON.Scene
    camera:BABYLON.ArcRotateCamera
    source:BABYLON.Mesh
    constructor(
        scene:BABYLON.Scene,
        camera:BABYLON.ArcRotateCamera|null,
        source:BABYLON.Mesh|null){
        this.source = source;
        this.scene = scene;
        this.camera = camera;
    }
}
export class GameEvents {
    public static OnMeshSelectedObservable:BABYLON.Observable<GameEvent> = new BABYLON.Observable<GameEvent>();
    public static OnMeshSelectionFailedObservable:BABYLON.Observable<GameEvent> = new BABYLON.Observable<GameEvent>();
    public static OnMatchFoundObservable:BABYLON.Observable<GameEvent> = new BABYLON.Observable<GameEvent>();
    public static OnGamePausedObservable:BABYLON.Observable<GameEvent> = new BABYLON.Observable<GameEvent>();
    public static OnGameResumedObservable:BABYLON.Observable<GameEvent> = new BABYLON.Observable<GameEvent>();
    public static OnGameRestartObservable:BABYLON.Observable<GameEvent> = new BABYLON.Observable<GameEvent>();
    public static OnLevelCompleted:BABYLON.Observable<GameEvent> = new BABYLON.Observable<GameEvent>();
} 