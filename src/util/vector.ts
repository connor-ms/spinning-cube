export class Vec2 {
    constructor(public x: number = 0, public y: number = 0) {}
}

export class Vec3 {
    constructor(public x: number = 0, public y: number = 0, public z: number = 0) {}

    multiply(val: number) {
        this.x *= val;
        this.y *= val;
        this.z *= val;
    }
}
