const Message = {
  /**
  * Read content and return command type
  * @param {String} Content of QQ Message.
  * @returns {String} Command Type of Message.
  *
  */
  readCommand(content){
    const helpRegax = /(^\/help$)/;
    const statusRegax = /(^\/status$)/;
    const startRegax = /(^\/start$)/;
    const stopRegax = /(^\/stop$)/;
    const chooseRegax = /^(\/choose) ([\s\S]*)$/;

    if(content){
      if(content.match(helpRegax)){
        return 'help';
      }
      if(content.match(startRegax)){
        return 'start';
      }
      if(content.match(stopRegax)){
        return 'stop';
      }
      if(content.match(statusRegax)){
        return 'status';
      }
      if(content.match(chooseRegax)){
        return 'choose';
      }
    }
  },
}
module.exports = Message;
