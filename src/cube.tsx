
type Vertex = [number, number, number];
type Matrix = number[][];

export default class Cube {
    public static doIt(): string {
        type Vertex = [number, number, number];
        type Matrix = number[][];

        // Define the original unit cube vertices centered at the origin
        const unitCubeVertices: Vertex[] = [
            [-1, -1, -1], [1, -1, -1],
            [1, 1, -1], [-1, 1, -1],
            [-1, -1, 1], [1, -1, 1],
            [1, 1, 1], [-1, 1, 1]
        ];

        // Convert degrees to radians
        const toRadians = (degrees: number): number => degrees * Math.PI / 180;

        // Rotation matrices
        const rotationMatrixX = (theta: number): Matrix => [
            [1, 0, 0],
            [0, Math.cos(theta), -Math.sin(theta)],
            [0, Math.sin(theta), Math.cos(theta)]
        ];

        const rotationMatrixY = (theta: number): Matrix => [
            [Math.cos(theta), 0, Math.sin(theta)],
            [0, 1, 0],
            [-Math.sin(theta), 0, Math.cos(theta)]
        ];

        const rotationMatrixZ = (theta: number): Matrix => [
            [Math.cos(theta), -Math.sin(theta), 0],
            [Math.sin(theta), Math.cos(theta), 0],
            [0, 0, 1]
        ];

        // Matrix multiplication functions
        const multiplyMatrixVector = (matrix: Matrix, vector: Vertex): Vertex => {
            const [x, y, z] = vector;
            return [
                matrix[0][0] * x + matrix[0][1] * y + matrix[0][2] * z,
                matrix[1][0] * x + matrix[1][1] * y + matrix[1][2] * z,
                matrix[2][0] * x + matrix[2][1] * y + matrix[2][2] * z
            ];
        };

        const multiplyMatrices = (a: Matrix, b: Matrix): Matrix => {
            const result: Matrix = [
                [0, 0, 0],
                [0, 0, 0],
                [0, 0, 0]
            ];

            for (let i = 0; i < 3; i++) {
                for (let j = 0; j < 3; j++) {
                    result[i][j] = a[i][0] * b[0][j] + a[i][1] * b[1][j] + a[i][2] * b[2][j];
                }
            }

            return result;
        };

        // Set cube size and distance from the camera
        const cubeSize = 1; // Set the desired size of the cube (half of the length of one side)
        const distance = 2; // Set the distance from the camera

        // Scale and translate the unit cube vertices
        const scaledTranslatedVertices: Vertex[] = unitCubeVertices.map(([x, y, z]) => [
            x * cubeSize,
            y * cubeSize,
            z * cubeSize + distance
        ]);

        // Combine rotations
        const thetaX = toRadians(30);
        const thetaY = toRadians(45);
        const thetaZ = toRadians(60);

        const rotationMatrix = multiplyMatrices(
            rotationMatrixZ(thetaZ),
            multiplyMatrices(rotationMatrixY(thetaY), rotationMatrixX(thetaX))
        );

        // Rotate vertices
        const rotatedVertices: Vertex[] = scaledTranslatedVertices.map(vertex => multiplyMatrixVector(rotationMatrix, vertex));

        // Perspective projection parameters
        const fov = 90;
        const f = 1 / Math.tan(toRadians(fov) / 2);

        // Apply perspective projection
        const projectedVertices = rotatedVertices.map(([x, y, z]) => [f * x / z, f * y / z] as [number, number]);

        // Screen dimensions
        const width = 63;
        const height = 31;

        // Convert to screen coordinates
        const screenCoords = projectedVertices.map(([x, y]) => [
            Math.round((x + 1) / 2 * width),
            Math.round((1 - y) / 2 * height)
        ]);

        // Create a grid and plot the vertices
        const grid = Array.from({ length: height }, () => Array(width).fill(' '));
        screenCoords.forEach(([x, y]) => {
            if (x >= 0 && x < width && y >= 0 && y < height) {
                grid[y][x] = 'x'; // Use 'x' to represent a vertex
            }
        });

        // Convert the grid to a string
        const gridString = grid.map(row => row.join('')).join('\n');
        return gridString;
    }
}

