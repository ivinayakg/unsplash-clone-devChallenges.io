function shuffle(array) {
  return array.sort(() => Math.random() - 0.5).sort(() => Math.random() - 0.5);
}

module.exports = shuffle;
