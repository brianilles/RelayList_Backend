module.exports = {
  screenContent
};

function screenContent(content) {
  if (!content.length >= 1) {
    return false;
  }

  const validTypes = ['h', 'p', 'b', 'i', 'q'];
  for (i in content) {
    if (!validTypes.includes(content[i].type)) {
      return false;
    }

    if (!content[i].type || !content[i].value) {
      return false;
    }
  }

  return true;
}
