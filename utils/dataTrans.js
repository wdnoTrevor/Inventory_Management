// Function to transform incoming flat data to nested structure
function transformBedData(data) {
    return {
        bed: {
            name: data.bedName,
            size: {
                x: data.bedSizeX === '' ? null : Number(data.bedSizeX),
                y: data.bedSizeY === '' ? null : Number(data.bedSizeY),
            },
            pos: {
                hor: data.bedPosHor === '' ? null : Number(data.bedPosHor),
                ver: data.bedPosVer === '' ? null : Number(data.bedPosVer),
            }
        }
    };
}
// Export the function
module.exports = {
    transformBedData
};
