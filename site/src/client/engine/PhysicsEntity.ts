import { DOM_HEIGHT, DOM_WIDTH, HEIGHT, TILE_HEIGHT, TILE_WIDTH } from "../Config";
import { ServiceLocator } from "../services/ServiceLocator";
import { Entity } from "./Entity";



export class PhysicsEntity implements Entity {

    // position and movement variables
    public x: number = 0;
    public y: number = 0;
    public xVel: number = 0;
    public yVel: number = 0;
    protected frictCoeff = 0.05;
    protected collides: boolean = true;

    // size of img
    protected width = 30;
    protected height = 30;


    public constructor(serviceLocator: ServiceLocator, x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    public update(serviceLocator: ServiceLocator) {
        this.x += this.xVel;
        this.y += this.yVel;
        this.friction();
        this.boundCheck();
        this.collisionCheck(serviceLocator);
    }

    // Movement functions to call when you want the entity to move
    public moveRight(speed: number){
        this.xVel += speed;
    }
    public moveDown(speed: number){
        this.yVel += speed;
    }

    // Friction function to run on each update
    // TODO: Consider scaling friction based on current speed
    private friction(){
        if(this.yVel > 0){
            this.yVel -= this.frictCoeff
            // Don't let friction reverse direction
            if(this.yVel < 0){
                this.yVel = 0;
            }
        }
        if(this.yVel < 0){
            this.yVel += this.frictCoeff
            // Don't let friction reverse direction
            if(this.yVel > 0){
                this.yVel = 0;
            }
        }
        if(this.xVel > 0){
            this.xVel -= this.frictCoeff
            // Don't let friction reverse direction
            if(this.xVel < 0){
                this.xVel = 0;
            }
        }
        if(this.xVel < 0){
            this.xVel += this.frictCoeff
            // Don't let friction reverse direction
            if(this.xVel > 0){
                this.xVel = 0;
            }
        }
    }

    // Check if the entity hits a boundary
    private boundCheck(){
        if (!this.collides) return;

        if(this.x < 0){
            this.xVel = -this.xVel;
            this.x = 0;
        }else if(this.x > 32 * 32){
            this.xVel = -this.xVel;
            this.x = 32 * 32;
        }
        if(this.y < 0){
            this.yVel = -this.yVel;
            this.y = 0;
        }else if(this.y > 32 * 32){
            this.yVel = -this.yVel;
            this.y = 32 * 32;
        }
    }

    private collisionCheck(serviceLocator: ServiceLocator){
        if (!this.collides) return;

        let left: number = Math.floor(this.x/TILE_WIDTH);
        let lleft: number = Math.floor((this.x + 1)/TILE_WIDTH);
        let right: number = Math.floor((this.x + this.width)/TILE_WIDTH);
        let rright: number = Math.floor((this.x + this.width - 1)/TILE_WIDTH);
        let up: number = Math.floor(this.y/TILE_HEIGHT);
        let uup: number = Math.floor((this.y + 1)/TILE_HEIGHT);
        let low: number = Math.floor((this.y + this.height)/TILE_HEIGHT);
        let llow: number = Math.floor((this.y + this.height - 1)/TILE_HEIGHT);
        // set tile to be the getTile function
        let tile = (x: number, y: number) => serviceLocator.getScriptingService().getMap().getTile(x, y);

        // left collision
        if(tile(left, up) && tile(left, uup)){
            this.xVel = -this.xVel;
            this.x = right * TILE_WIDTH;
        }
        else if(tile(left, low) && tile(left, llow)){
            this.xVel = -this.xVel;
            this.x = right * TILE_WIDTH;
        }

        // right collision
        else if(tile(right, up) && tile(right, uup)){
            this.xVel = -this.xVel;
            this.x = (left + 1) * TILE_WIDTH - this.width;
        }
        else if(tile(right, low) && tile(right, llow)){
            this.xVel = -this.xVel;
            this.x = (left + 1) * TILE_WIDTH - this.width;
        }

        // up collision
        if(tile(right, up) && tile(rright, up)){
            this.yVel = -this.yVel;
            this.y = low * TILE_HEIGHT;
        }
        else if(tile(left, up) && tile(lleft, up)){
            this.yVel = -this.yVel;
            this.y = low * TILE_HEIGHT;
        }

        // low collision
        else if(tile(right, low) && tile(rright, low)){
            this.yVel = -this.yVel;
            this.y = (up + 1) * TILE_HEIGHT - this.height;
        }
        else if(tile(left, low) && tile(lleft, low)){
            this.yVel = -this.yVel;
            this.y = (up + 1) * TILE_HEIGHT - this.height;
        }
        
    }

    public distanceTo(otherEntity: PhysicsEntity) {
        const diffX = otherEntity.x - this.x;
        const diffY = otherEntity.y - this.y;
        return Math.sqrt((diffX * diffX) + (diffY * diffY));
    }

    public angleTo(otherEntity: PhysicsEntity) {
        const diffX = otherEntity.x - this.x;
        const diffY = otherEntity.y - this.y;
        return (Math.atan2(diffX, -diffY) / Math.PI) * 180;
    }

    public onAddedToWorld(serviceLocator: ServiceLocator) {
    }
    public onRemovedFromWorld(serviceLocator: ServiceLocator) {
    }
}
