export class Vec2 {
    constructor(public x: number = 0, public y: number = 0) {}
}

export class Vec4 {
    constructor(public x: number = 0, public y: number = 0, public z: number = 0, public w: number = 1) {}

    add(other: Vec4) {
        this.x += other.x;
        this.y += other.y;
        this.z += other.z;
    }

    addAndWrap(other: Vec4, min?: number, max?: number) {
        const addAndWrap = (value: number, increment: number, min: number = 0, max: number = 360) => {
            let sum = value + increment;
            if (sum < min) sum += max;
            return sum % (max + 1);
        };

        this.x = addAndWrap(this.x, other.x, min, max);
        this.y = addAndWrap(this.y, other.y, min, max);
        this.z = addAndWrap(this.z, other.z, min, max);
    }

    subtract(other: Vec4) {
        this.x -= other.x;
        this.y -= other.y;
        this.z -= other.z;
    }

    divide(divisor: number) {
        this.x /= divisor;
        this.y /= divisor;
        this.z /= divisor;
    }

    scale(val: number) {
        this.x *= val;
        this.y *= val;
        this.z *= val;
    }

    length() {
        return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
    }

    normalize() {
        let length = this.length();
        this.x /= length;
        this.y /= length;
        this.z /= length;
    }
}
