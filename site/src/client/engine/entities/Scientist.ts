import { SCIENTIST_ATTACK_STRENGTH, SCIENTIST_SPEED } from "../../Config";
import { ServiceLocator } from "../../services/ServiceLocator";
import { CanvasHelper } from "../../util/CanvasHelper";
import { Player } from "./Player";


const SCIENTIST_WIDTH = 30;
const SCIENTIST_HEIGHT = 30;

export class Scientist extends Player {

    public name: string = "Scientist";

    public constructor(serviceLocator: ServiceLocator, x: number, y: number) {
        super(serviceLocator, x, y, "scientist", SCIENTIST_WIDTH, SCIENTIST_HEIGHT, "test_tube");
        this.damage = SCIENTIST_ATTACK_STRENGTH;
        this.speed = SCIENTIST_SPEED;
    }

    public update(serviceLocator: ServiceLocator) {
        super.update(serviceLocator);
    }

    public onAddedToWorld(serviceLocator: ServiceLocator) {
    }
    public onRemovedFromWorld(serviceLocator: ServiceLocator) {
    }
}
