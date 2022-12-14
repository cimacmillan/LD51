import { CHARACTER_ANIMATION_MULTIPLIER, CHARACTER_ANIMATION_SPEED_THRESHOLD, CHARACTER_ATTACK_ARC, CHARACTER_ATTACK_BUMP_STRENGTH, CHARACTER_ATTACK_DISTANCE, CHARACTER_HAND_DISTANCE, CHARACTER_HAND_SIZE, CHARACTER_HEALTH_HEIGHT, CHARACTER_HEALTH_SHOWN, CHARACTER_HEALTH_WIDTH, CHARACTER_LOWER_DROP, PATHFIND_EVERY_FRAMES, TILE_HEIGHT, TILE_WIDTH } from "../../Config";
import { ServiceLocator } from "../../services/ServiceLocator";
import { animation } from "../../util/animation/Animations";
import { GameAnimation } from "../../util/animation/GameAnimation";
import { CanvasHelper } from "../../util/CanvasHelper";
import { randomFloatRange, randomIntRange } from "../../util/math";
import { RemoveCharacterFromGird, AddCharacterToGrid, PathfindTo } from "../../util/Pathfinding";
import { Entity } from "../Entity";
import { PhysicsEntity } from "../PhysicsEntity";
import { DeadBody } from "./DeadBody";
import { Particle } from "./Particle";



export class CharacterEntity extends PhysicsEntity {

    protected maxHp: number = 20;
    public hp: number = 20;
    public speed: number = 0.5;
    protected damage: number = 5;

    // Animation frame to draw
    protected animation = "";
    protected animation_frame = 0;
    protected animation_width = 0;
    protected animation_height = 0;
    protected animation_facing_right = true;
    // protected show_health = false;
    protected show_health_timeout: any = undefined;

    protected hand_image = "";
    protected hand_angle = 90;
    protected hand_dis = CHARACTER_HAND_DISTANCE;

    public hand_attack: GameAnimation;

    public tileX = -1;
    public tileY = -1;

    public constructor(
        protected serviceLocator: ServiceLocator, 
        x: number, 
        y: number, 
        animation_name: string,
        animation_width: number, 
        animation_height: number,
        hand_image: string
        ) {
        super(serviceLocator, x, y);
        this.animation = animation_name;
        this.animation_width = animation_width;
        this.animation_height = animation_height
        this.hand_image = hand_image;
        this.hand_attack = animation(x => {
            this.hand_dis = (1 - x) * CHARACTER_HAND_DISTANCE + CHARACTER_HAND_DISTANCE
        }).driven(true).speed(100).whenDone(() => this.hand_dis = CHARACTER_HAND_DISTANCE);
    }

    public update(serviceLocator: ServiceLocator) {
        super.update(serviceLocator);
        this.movement();
        this.updateAnimationFrame();
        this.drawMovingAnimation(serviceLocator);
        this.drawHpBar(serviceLocator);
        this.drawHand(serviceLocator);
        this.updateGridPosition();
    }

    public onAddedToWorld(serviceLocator: ServiceLocator) {
        this.updateGridPosition();
    }
    public onRemovedFromWorld(serviceLocator: ServiceLocator) {
        this.updateGridPosition();
    }

    private updateGridPosition() {
        const tileX = Math.floor(this.x / TILE_WIDTH);
        const tileY = Math.floor(this.y / TILE_HEIGHT);

        if (this.tileX != tileX || this.tileY != tileY) {
            RemoveCharacterFromGird(this.tileX, this.tileY, this);
            AddCharacterToGrid(tileX, tileY, this);
        }

        this.tileX = tileX;
        this.tileY = tileY;
    }

    public movement(){
        if(Math.abs(this.xVel) > this.speed){
            this.xVel = Math.sign(this.xVel) * this.speed;
        }
        if(Math.abs(this.yVel) > this.speed){
            this.yVel = Math.sign(this.yVel) *  this.speed;
        }

        if (this.xVel < 0) {
            this.animation_facing_right = false;
        } else if (this.xVel > 0) {
            this.animation_facing_right = true;
        }
    }

    private drawMovingAnimation(serviceLocator: ServiceLocator) {
        const scale_x = this.animation_facing_right ? 1 : -1;
        CanvasHelper.drawAnimation(serviceLocator, this.animation, Math.floor(this.animation_frame), this.x, this.y, this.animation_width, this.animation_height, scale_x);
    }

    private drawHpBar(serviceLocator: ServiceLocator) {
        // if (!this.show_health) return;

        const x = this.x;
        const y = this.y - this.animation_height / 2;
        const ratio = this.hp / this.maxHp;

        CanvasHelper.drawRectangle(
            serviceLocator,
            x,
            y, 
            CHARACTER_HEALTH_WIDTH,
            CHARACTER_HEALTH_HEIGHT,
            0,
            true,
            "#000000"
        );

        CanvasHelper.drawRectangle(
            serviceLocator,
            x,
            y, 
            CHARACTER_HEALTH_WIDTH * ratio,
            CHARACTER_HEALTH_HEIGHT,
            0,
            true,
            "#AA0000"
        );
    } 

    private drawHand(serviceLocator: ServiceLocator) {
        const ang = (this.hand_angle / 180) * Math.PI;
        const x = Math.sin(ang) * this.hand_dis + this.x;
        const y = -Math.cos(ang) * this.hand_dis + this.y + CHARACTER_LOWER_DROP;
        const scaleX = Math.sign(Math.sin(ang));
        CanvasHelper.drawSprite(serviceLocator, this.hand_image, x, y, CHARACTER_HAND_SIZE, CHARACTER_HAND_SIZE, scaleX);
    }

    public onDamage(damage: number, from_angle: number) {
        if (this.hp == 0) return;
        
        this.hp -= damage;

        this.spewBlood(from_angle);

        if (this.hp <= 0) {
            this.hp = 0;
            this.onDeath();
            this.serviceLocator.getAudioService().play("point");
        } else {
            this.serviceLocator.getAudioService().play("slam");
        }

        // this.show_health = true;
        // this.show_health_timeout && clearTimeout(this.show_health_timeout);
        // this.show_health_timeout = setTimeout(() => this.show_health = false, CHARACTER_HEALTH_SHOWN);

        const rads = (from_angle / 180) * Math.PI;
        this.xVel += Math.sin(rads) * CHARACTER_ATTACK_BUMP_STRENGTH;
        this.yVel -= Math.cos(rads) * CHARACTER_ATTACK_BUMP_STRENGTH;

    }

    private spewBlood(from_angle: number) {
        for (let i = 0; i < 10; i++) {
            const rads = (from_angle / 180) * Math.PI + randomFloatRange(-0.3, 0.3);
            const speed = randomFloatRange(1, 2);
            this.serviceLocator.getWorld().addEntity(
                new Particle(this.serviceLocator,
                    this.x + randomFloatRange(-this.width/4, this.width/4), 
                    this.y + randomFloatRange(-this.height/4, this.height/4), 
                    randomIntRange(1, 6), 
                    "#FF0000", 
                    20,
                    Math.sin(rads) * speed,
                    -Math.cos(rads) * speed
                    )
            );
        }
    }

    public onDeath() {
        this.serviceLocator.getWorld().removeEntity(this);
        this.serviceLocator.getWorld().addEntity(new DeadBody(this.x, this.y))
    }

    public setHand(angle: number, distance: number = CHARACTER_HAND_DISTANCE) {
        this.hand_angle = angle;

        if (!this.hand_attack.isPlaying()) {
            this.hand_dis = Math.min(distance, CHARACTER_HAND_DISTANCE);
        }
    }

    public getHandAngle() {
        return this.hand_angle;
    }

    public doAttack(angle: number) {
        if (this.hand_attack.isPlaying()) {
            return;
        }
        this.hand_attack.start();
        const entities = this.serviceLocator.getWorld().getEntityArray();
        for (let entity of entities) {
            if (!(entity instanceof CharacterEntity) || entity == this) {
                continue;
            }
            const otherCharacter = entity as CharacterEntity;
            this.tryAttack(angle, otherCharacter);
        }
    }

    private tryAttack(angle: number, character: CharacterEntity) {
        const diffX = character.x - this.x;
        const diffY = character.y - this.y;
        const distance = Math.sqrt((diffX * diffX) + (diffY * diffY));
        if (distance > CHARACTER_ATTACK_DISTANCE) {
            return;
        }

        const angleToCharacter = (Math.atan2(diffX, -diffY) / Math.PI) * 180;
        const angleDiff = Math.abs(angleToCharacter - angle);

        if (angleDiff > CHARACTER_ATTACK_ARC/2) {
            return;
        }
        
        character.onDamage(this.damage, angleToCharacter);
        
    }

    private updateAnimationFrame() {
        const speed = Math.sqrt(this.xVel * this.xVel + this.yVel * this.yVel) * CHARACTER_ANIMATION_MULTIPLIER;
        this.animation_frame = (this.animation_frame + speed) % 2;
        if (speed < CHARACTER_ANIMATION_SPEED_THRESHOLD) {
            this.animation_frame = 0;
        }
    }

    private pathfindNumber = 0;
    private cacheDelta = -1;
    public getDirectionToTravelTo(otherEntity: CharacterEntity): number {
        if (this.tileX == otherEntity.tileX && this.tileY == otherEntity.tileY) {
            return this.angleTo(otherEntity);
        }

        if (this.cacheDelta == -1 || this.pathfindNumber % PATHFIND_EVERY_FRAMES == 0) {
            this.cacheDelta =  PathfindTo(this.serviceLocator, this.tileX, this.tileY, otherEntity, this)
        } 
        this.pathfindNumber += 1;
        return this.cacheDelta;
    }

}
