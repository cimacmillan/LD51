import { SOLDIER_ATTACK_STRENGTH, SOLDIER_SPEED } from "../../Config";
import { ServiceLocator } from "../../services/ServiceLocator";
import { CanvasHelper } from "../../util/CanvasHelper";
import { Player } from "./Player";


const SOLDIER_WIDTH = 30;
const SOLDIER_HEIGHT = 30;

export class Solider extends Player {

    public name: string = "Soldier";

    public constructor(serviceLocator: ServiceLocator, x: number, y: number) {
        super(serviceLocator, x, y, "soldier", SOLDIER_WIDTH, SOLDIER_HEIGHT, "knife");
        this.damage = SOLDIER_ATTACK_STRENGTH;
        this.speed = SOLDIER_SPEED;
    }

    public update(serviceLocator: ServiceLocator) {
        super.update(serviceLocator);
    }

    public onAddedToWorld(serviceLocator: ServiceLocator) {
    }
    public onRemovedFromWorld(serviceLocator: ServiceLocator) {
    }
}
