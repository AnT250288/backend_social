const validLength = (text, min, max) => {
    return !(text.length > max || text.length < min);
}

module.exports = validLength