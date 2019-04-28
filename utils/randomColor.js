var colors = [
    'DC143C',
    '8B0000',
    'C71585',
    'FF1493',
    'FF4500',
    '8A2BE2',
    '8B008B',
    '4B0082',
    '483D8B',
    '2E8B57',
    '008080',
    '191970',
    '800000',
    '000000'
];

function random() {
    return Math.floor(Math.random() * (colors.length - 0)) + 0;
};

function colorRandom(){
    return colors[random()];
}

module.exports = colorRandom;