import { ServiceLocator } from "../../services/ServiceLocator";
import { CanvasHelper } from "../../util/CanvasHelper";
import { Entity } from "../Entity";


export class MinerEntity implements Entity {
    private x: number;
    private y: number;
    private time: number = 0;

    public constructor(serviceLocator: ServiceLocator, x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    public update(serviceLocator: ServiceLocator) {
        this.time += 0.02;

        CanvasHelper.drawAnimationInterp(serviceLocator, "miner", this.time, this.x, this.y, 50, 50);
    };

    public onAddedToWorld(serviceLocator: ServiceLocator) {

    };
 
    public onRemovedFromWorld(serviceLocator: ServiceLocator) {

    };
}