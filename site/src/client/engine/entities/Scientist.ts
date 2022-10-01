import { ServiceLocator } from "../../services/ServiceLocator";
import { CanvasHelper } from "../../util/CanvasHelper";
import { Player } from "./Player";


const SCIENTIST_WIDTH = 30;
const SCIENTIST_HEIGHT = 30;

export class Scientist extends Player {


    public constructor(serviceLocator: ServiceLocator, x: number, y: number) {
        super(serviceLocator, x, y);
    }

    public update(serviceLocator: ServiceLocator) {
        CanvasHelper.drawSprite(serviceLocator, "scientist", this.x, this.y, SCIENTIST_WIDTH, SCIENTIST_HEIGHT);
    }

    public onAddedToWorld(serviceLocator: ServiceLocator) {
    }
    public onRemovedFromWorld(serviceLocator: ServiceLocator) {
    }
}