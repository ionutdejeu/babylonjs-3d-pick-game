import * as BABYLON from '@babylonjs/core'
import {GameEvent,GameEvents} from './game_events';

export class GameCubeMatch {

    hl:BABYLON.HighlightLayer;
    selectedMeshes:Array<BABYLON.Mesh> = [];
    selectionSubscription:any;

    constructor(scene:BABYLON.Scene){
        this.hl = new BABYLON.HighlightLayer("highlight",scene);
        this.selectionSubscription = GameEvents.SelectionObservable.add((evt:GameEvent)=>{this.OnCubeSelectedEvent(evt);});
    }
    
    public OnCubeSelectedEvent(evt:GameEvent){
        
        if(this.selectedMeshes.length>0){
            // check for match
            
            if(this.selectedMeshes[0].metadata["value"] == evt.source.metadata["value"]){
                console.log("match found");
                this.createLinkBetweenMatches(evt.scene,this.selectedMeshes[0],evt.source);
                this.hl.addMesh(evt.source,BABYLON.Color3.Green());
                this.selectedMeshes.splice(0,1);
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