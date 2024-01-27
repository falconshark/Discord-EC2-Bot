const querystring = require('querystring');

const Aws = {
  startServer(ec2, config){
    return new Promise((resolve, reject) => {
      const params = {
        InstanceIds: [config['instanceId']],
      };
      ec2.startInstances(params, function (err, data) {
        if (err) {
          reject(err);
          return;
        }
        resolve(data.StartingInstances);
      });
    });
  },
  stopServer(ec2, config){
    return new Promise((resolve, reject) => {
      const params = {
        InstanceIds: [config['instanceId']],
      };
      ec2.stopInstances(params, function (err, data) {
        if (err) {
          reject(err);
          return;
        }
        resolve(data.StoppingInstances);
      });
    });
  },
  checkStatus(ec2, config){
    return new Promise((resolve, reject) => {
      const params = {
        InstanceIds: [config['instanceId']],
      };
      ec2.describeInstanceStatus(params, function (err, data) {
        if (err) {
          reject(err);
          return;
        }
        resolve(data.InstanceStatuses[0]);
      });
    });
  },
}
module.exports = Aws;
