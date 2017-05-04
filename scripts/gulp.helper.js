import gutil, {PluginError} from 'gulp-util';
import through from 'through2';
import path from 'path';
import yaml from 'js-yaml';
import File from 'vinyl';

const PLUGIN_NAME = 'gulp-swagger';

export function concat(fileName) {
  let joinedContents = '';
  return through.obj(function(file, encoding, cb) {
    if (file.isNull()) return cb(null, file);

    if (file.isStream()) {
      this.emit('error',
        new PluginError(PLUGIN_NAME, 'Streams not supported!'));
    } else if (file.isBuffer()) {
      joinedContents += `${file.contents}\n`;
      return cb(null);
    }
  }, function(cb) {
    let joinedFile = new File({path: `${fileName}`});
    joinedFile.contents = new Buffer(joinedContents);
    this.push(joinedFile);
    gutil.log('Done.');
    return cb();
  });
}

export function merge(name) {
  let joinedContents = {};
  return through.obj(function(file, encoding, cb) {
    if (file.isNull()) return cb(null, file);

    if (file.isStream()) {
      this.emit('error',
        new PluginError(PLUGIN_NAME, 'Streams not supported!'));
    } else if (file.isBuffer()) {
      let contents = yaml.safeLoad(file.contents);
      let stem = path.basename(file.path, '.yaml');
      gutil.log(`Loading contents from ${stem}`);
      joinedContents[stem] = contents;
      return cb();
    }
  }, function(cb) {
    let joinedFile = new File({path: `${name}.yaml`});
    joinedFile.contents = new Buffer(yaml.safeDump({[name]: joinedContents}));
    this.push(joinedFile);
    gutil.log('Done.');
    return cb();
  });
}
