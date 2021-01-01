import * as BABYLON from '@babylonjs/core'
import {GameEvent,GameEvents} from './game_events';

export class GameCubeMatch {

    hl:BABYLON.HighlightLayer;
    selectedMeshes:Array<BABYLON.Mesh> = [];
    selectionSubscription:any;
    matchingEnabled:boolean = false;
    nrOfMatchedPairs:number=0;
    nrOfTotalPairs:number;

    constructor(scene:BABYLON.Scene,numberOfPairsToMatch:number){
        this.hl = new BABYLON.HighlightLayer("highlight",scene);
        this.nrOfTotalPairs = numberOfPairsToMatch;
        this.selectionSubscription = GameEvents.OnMeshSelectedObservable.add((evt:GameEvent)=>{this.OnCubeSelectedEvent(evt);});
        GameEvents.OnGamePausedObservable.add((evt:GameEvent)=>{this.matchingEnabled=false});
        GameEvents.OnGameResumedObservable.add((evt:GameEvent)=>{this.matchingEnabled=true});
    }
    
    public OnCubeSelectedEvent(evt:GameEvent){
        if(!this.matchingEnabled) return;
        if(this.selectedMeshes.length>0){
            // check for match
            
            if(this.selectedMeshes[0].metadata["value"] == evt.source.metadata["value"]){ 
                //&&  this.selectedMeshes[0].name!==evt.source.name){
                console.log("match found");
                //this.createLinkBetweenMatches(evt.scene,this.selectedMeshes[0],evt.source);
                //this.hl.addMesh(evt.source,BABYLON.Color3.Green());
                
                GameEvents.OnMatchFoundObservable.notifyObservers(evt);
                this.hl.removeMesh(this.selectedMeshes[0]);

                this.selectedMeshes[0].isVisible = false;
                evt.source.isVisible = false;
                this.selectedMeshes.splice(0,1);
                this.nrOfMatchedPairs++;
                this.checkWin(evt);
            }
            else{
                console.log("match NOT found");
                this.hl.removeMesh(this.selectedMeshes[0]);
                this.selectedMeshes.splice(0,1);
            }
        }else{               
            this.hl.addMesh(evt.source, BABYLON.Color3.Green());
            this.selectedMeshes.push(evt.source);
        }
    }
    updateLevelWinCondition(nrOfTotalPairs:number){
        this.nrOfTotalPairs = nrOfTotalPairs;
        this.nrOfMatchedPairs = 0;
    }
    checkWin(g:GameEvent){

        if(this.nrOfMatchedPairs>=this.nrOfTotalPairs){
            GameEvents.OnLevelCompleted.notifyObservers(g);
        }
        else{
            console.log('not win',this.nrOfMatchedPairs,this.nrOfTotalPairs);
        }
    }
    private createLinkBetweenMatches(scene:BABYLON.Scene,source:BABYLON.Mesh,target:BABYLON.Mesh){
        let middlePoint = BABYLON.Vector3.Lerp(source.position,target.position,0.5);
        //evt.scene.onBeforeRenderObservable.add
        middlePoint=middlePoint.add(middlePoint.normalizeToNew().scale(BABYLON.Vector3.Distance(source.position,target.position)));
        let curve = BABYLON.Curve3.CreateQuadraticBezier(source.position,middlePoint, target.position,10);
        let meshOfCurve = BABYLON.Mesh.CreateLines("trajectorAttack_"+source.name+"_to_"+target.name, curve.getPoints(), scene);
        meshOfCurve.color = new BABYLON.Color3(1, 1, 0.5);
        meshOfCurve.edgesWidth = 11;
    }
}