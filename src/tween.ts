import * as BABYLON from '@babylonjs/core';

export class Tween {
    public static frameRate:number = 30;

    static createTween2D(scene: BABYLON.Scene, target : any, targetProperty:string, startValue:BABYLON.Vector2, endValue:BABYLON.Vector2, duration:number, loopMode:number, easingFunction?:BABYLON.EasingFunction, easingMode:number=BABYLON.EasingFunction.EASINGMODE_EASEIN){

        let totalFrame = this.frameRate*duration; // redundant
        let animation = this.createAnimation2D(target, targetProperty, startValue, endValue, duration, loopMode, easingFunction, easingMode);
        let animTable = new BABYLON.Animatable(scene, target, 0, totalFrame, false, 1, ()=>{}, [animation]);
        animTable.pause();
        return animTable;
    }

    static addTween2D(animManager: BABYLON.Animatable, target : any, targetProperty:string, startValue:BABYLON.Vector2, endValue:BABYLON.Vector2, duration:number, loopMode:number, easingFunction?:BABYLON.EasingFunction, easingMode:number=BABYLON.EasingFunction.EASINGMODE_EASEIN){

        let animation = this.createAnimation2D(target, targetProperty, startValue, endValue, duration, loopMode, easingFunction, easingMode);

        animManager.appendAnimations(target, [animation]);
        
    }

    private static createAnimation2D (target : any, targetProperty:string, 
                            startValue:BABYLON.Vector2, endValue:BABYLON.Vector2, 
                            duration:number, loopMode:number, easingFunction?:BABYLON.EasingFunction, easingMode:number=BABYLON.EasingFunction.EASINGMODE_EASEIN) : BABYLON.Animation {
        
        let totalFrame = this.frameRate*duration;
        let animation = new BABYLON.Animation("Tween." + target.name + "." + targetProperty, 
                                                targetProperty, this.frameRate, 
                                                BABYLON.Animation.ANIMATIONTYPE_VECTOR2, 
                                                loopMode);

        let keyFrames = []; 

        keyFrames.push({
            frame: 0,
            value: startValue,
        });

        keyFrames.push({
            frame: totalFrame,
            value: endValue,
        });

        animation.setKeys(keyFrames);
        
        if(easingFunction){
            easingFunction.setEasingMode(easingMode);
            animation.setEasingFunction(easingFunction);
        }

        return animation
    }
    
    static createTween1D(scene: BABYLON.Scene, target : any, targetProperty:string, startValue:number, endValue:number, duration:number, loopMode:number, easingFunction?:BABYLON.EasingFunction, easingMode:number=BABYLON.EasingFunction.EASINGMODE_EASEIN){

        let totalFrame = this.frameRate*duration; // redundant
        let animation = this.createAnimation1D(target, targetProperty, startValue, endValue, duration, loopMode, easingFunction, easingMode);
        let animTable = new BABYLON.Animatable(scene, target, 0, totalFrame, false, 1, ()=>{}, [animation]);
        animTable.pause();
        return animTable;
        
    }

    static addTween1D(animManager: BABYLON.Animatable, target : any, targetProperty:string, startValue:number, endValue:number, duration:number, loopMode:number, easingFunction?:BABYLON.EasingFunction, easingMode:number=BABYLON.EasingFunction.EASINGMODE_EASEIN){

        let animation = this.createAnimation1D(target, targetProperty, startValue, endValue, duration, loopMode, easingFunction, easingMode);

        animManager.appendAnimations(target, [animation]);
        
    }

    private static createAnimation1D (target : any, targetProperty:string, 
                            startValue:number, endValue:number, 
                            duration:number, loopMode:number, easingFunction?:BABYLON.EasingFunction, easingMode:number=BABYLON.EasingFunction.EASINGMODE_EASEOUT) : BABYLON.Animation {
        
        let totalFrame = this.frameRate*duration;
        let animation = new BABYLON.Animation("Tween." + target.name + "." + targetProperty, 
                                                targetProperty, this.frameRate, 
                                                BABYLON.Animation.ANIMATIONTYPE_FLOAT, 
                                                loopMode);

        
        let keyFrames = []; 
        
        keyFrames.push({
            frame: 0,
            value: startValue,
        });
        
        keyFrames.push({
            frame: totalFrame,
            value: endValue,
        });
        
        animation.setKeys(keyFrames);
        
        if(easingFunction){
            easingFunction.setEasingMode(easingMode);
            animation.setEasingFunction(easingFunction);
        }

        return animation
    }
}