const random = require('random');

const Common = {
  choose(options){
    const index = random.int(0, options.length -1);
    const result = options[index];
    return result;
  },
  checkValheimStatus(request, statusUrl){
    return new Promise((resolve, reject) => {
      request.get(statusUrl,
      function (err, response, body) {
        let status = 'offline';
        if(err){
          resolve(status);
          return;
        }
        switch(response.statusCode){
          case 200:
          const datas = JSON.parse(body);
          const players = datas.players;

          if(players.length > 0){
            status = 'playing';
          }else{
            status = 'non_playing';
          }
          resolve(status);
          break;

          default:
          resolve(status);
        }
      });
    });
  },
}
module.exports = Common;
