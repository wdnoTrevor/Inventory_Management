function PositionValidator(sizeX, sizeY, posX, posY, positions) {
    for (let i = posX; i < sizeX + posX; i++) {
        for (let j = posY; j < sizeY + posY; j++) {
            positions.push({ x: i, y: j });
        }
    }
}

// Example usage:
const positions = [];
PositionValidator(7, 5, 1, 1, positions);
console.log(positions);
