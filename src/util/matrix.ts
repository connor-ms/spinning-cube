import { toRad, Triangle } from "../render";
import { Vec4 } from "./vector";

export default class Mat4x4 {
    public values: number[][];

    constructor(values?: number[][]) {
        if (values) this.values = values;
        else
            this.values = [
                [0, 0, 0, 0],
                [0, 0, 0, 0],
                [0, 0, 0, 0],
                [0, 0, 0, 0],
            ];
    }

    at(row: number, col: number): number {
        return this.values[row][col];
    }

    add(other: Mat4x4): Mat4x4 {
        let res = new Mat4x4();

        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                res.values[i][j] = this.values[i][j] + other.values[i][j];
            }
        }

        return res;
    }

    multiply(mat: Mat4x4): Mat4x4 {
        const resMatrix = new Mat4x4();
        resMatrix.values = resMatrix.values.map((row, i) => {
            return row.map((_, j) => {
                return this.values[i].reduce((sum, elm, k) => sum + elm * mat.at(k, j), 0);
            });
        });
        return resMatrix;
    }

    multiplyVector(vec: Vec4): Vec4 {
        let v = new Vec4();
        v.x = vec.x * this.values[0][0] + vec.y * this.values[1][0] + vec.z * this.values[2][0] + vec.w * this.values[3][0];
        v.y = vec.x * this.values[0][1] + vec.y * this.values[1][1] + vec.z * this.values[2][1] + vec.w * this.values[3][1];
        v.z = vec.x * this.values[0][2] + vec.y * this.values[1][2] + vec.z * this.values[2][2] + vec.w * this.values[3][2];
        v.w = vec.x * this.values[0][3] + vec.y * this.values[1][3] + vec.z * this.values[2][3] + vec.w * this.values[3][3];
        return v;
    }

    scaleRow(row: number) {
        this.values[0][row] /= this.values[3][row];
        this.values[1][row] /= this.values[3][row];
        this.values[2][row] /= this.values[3][row];
    }

    toTriangle(): Triangle {
        return new Triangle(
            new Vec4(this.at(0, 0), this.at(1, 0), this.at(2, 0)),
            new Vec4(this.at(0, 1), this.at(1, 1), this.at(2, 1)),
            new Vec4(this.at(0, 2), this.at(1, 2), this.at(2, 2))
        );
    }

    public static makeRotX(angle: number): Mat4x4 {
        angle = toRad(angle);
        return new Mat4x4([
            [1, 0, 0, 0],
            [0, Math.cos(angle), -Math.sin(angle), 0],
            [0, Math.sin(angle), Math.cos(angle), 0],
            [0, 0, 0, 1],
        ]);
    }

    public static makeRotY(angle: number): Mat4x4 {
        angle = toRad(angle);
        return new Mat4x4([
            [Math.cos(angle), 0, Math.sin(angle), 0],
            [0, 1, 0, 0],
            [-Math.sin(angle), 0, Math.cos(angle), 0],
            [0, 0, 0, 1],
        ]);
    }

    public static makeRotZ(angle: number): Mat4x4 {
        angle = toRad(angle);
        return new Mat4x4([
            [Math.cos(angle), -Math.sin(angle), 0, 0],
            [Math.sin(angle), Math.cos(angle), 0, 0],
            [0, 0, 1, 0],
            [0, 0, 0, 1],
        ]);
    }

    public static makeIdentity() {
        return new Mat4x4([
            [1, 0, 0, 0],
            [0, 1, 0, 0],
            [0, 0, 1, 0],
            [0, 0, 0, 1],
        ]);
    }

    public static makeTranslation(x: number, y: number, z: number) {
        let identity = Mat4x4.makeIdentity();

        identity.values[0][3] = x;
        identity.values[1][3] = y;
        identity.values[2][3] = z;

        return identity;
    }

    public static makeScale(x: number, y: number, z: number) {
        return new Mat4x4([
            [x, 0, 0, 0],
            [0, y, 0, 0],
            [0, 0, z, 0],
            [0, 0, 0, 1],
        ]);
    }
}
