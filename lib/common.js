const random = require('random');

const Common = {
  choose(options){
    const index = random.int(0, options.length -1);
    const result = options[index];
    return result;
  },
}
module.exports = Common;
