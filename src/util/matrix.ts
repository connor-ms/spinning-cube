import { Triangle } from "../render";
import { Vec3 } from "./vector";

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

    at(row: number, col: number) {
        return this.values[row][col];
    }

    multiply(mat: Mat4x4): Mat4x4 {
        const resMatrix = new Mat4x4();
        resMatrix.values = resMatrix.values.map((row, i) => {
            return row.map((val, j) => {
                return this.values[i].reduce((sum, elm, k) => sum + elm * mat.at(k, j), 0);
            });
        });
        return resMatrix;
    }

    toTriangle(): Triangle {
        return new Triangle(
            new Vec3(this.at(0, 0), this.at(0, 1), this.at(0, 2)),
            new Vec3(this.at(1, 0), this.at(1, 1), this.at(1, 2)),
            new Vec3(this.at(2, 0), this.at(2, 1), this.at(2, 2))
        );
    }

    public static makeRotX(angle: number): Mat4x4 {
        return new Mat4x4([
            [1, 0, 0, 0],
            [0, Math.cos(angle), -Math.sin(angle), 0],
            [0, Math.sin(angle), Math.cos(angle), 0],
            [0, 0, 0, 0],
        ]);
    }

    public static makeRotY(angle: number): Mat4x4 {
        return new Mat4x4([
            [Math.cos(angle), 0, Math.sin(angle), 0],
            [0, 1, 0, 0],
            [-Math.sin(angle), 0, Math.cos(angle), 0],
            [0, 0, 0, 0],
        ]);
    }

    public static makeRotZ(angle: number): Mat4x4 {
        return new Mat4x4([
            [Math.cos(angle), -Math.sin(angle), 0, 0],
            [Math.sin(angle), Math.cos(angle), 0, 0],
            [0, 0, 1, 0],
            [0, 0, 0, 0],
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
        identity.values[3][0] = x;
        identity.values[3][1] = y;
        identity.values[3][2] = z;
        return identity;
    }
}
