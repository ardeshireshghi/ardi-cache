import Promise from 'bluebird';
import AWS from 'aws-sdk';

AWS.config.setPromisesDependency(Promise);

export default class S3Store {
  constructor(bucket, connection, prefix = '') {
    this.bucket = bucket;
    this.prefix = prefix;
    this.setConnection(connection || this._createConnection());
  }

  put(key, value, minutes = 0) {
    if (typeof value === 'object') {
      value = JSON.stringify(value);
    }

    return this.connection().putObject({
      Body: value,
      Bucket: this.bucket,
      Key: this.prefix + key
    }).promise();
  }

  get(key) {
    return this.connection().getObject({
      Bucket: this.bucket,
      Key: this.prefix + key
    }).promise().then(content => content.Body.toString()).catch(err => {
      if (err.name === 'NoSuchKey') {
        return Promise.resolve(null);
      }

      return Promise.reject(err);
    });
  }

  forget(key) {
    return this.connection().deleteObject({
      Bucket: this.bucket,
      Key: this.prefix + key
    }).promise();
  }

  setConnection(connection) {
    this._connection = connection;
  }

  connection() {
    return this._connection;
  }

  _createConnection() {
    return new AWS.S3();
  }
}