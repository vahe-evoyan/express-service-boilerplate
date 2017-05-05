import gutil, {PluginError} from 'gulp-util';
import through from 'through2';
import path from 'path';
import yaml from 'js-yaml';
import File from 'vinyl';
import sway from 'sway';
import chalk from 'chalk';

const PLUGIN_NAME = 'gulp-swagger-redoc';

function createFile(fileName, contents) {
  let file = new File({path: fileName});
  file.contents = contents;
  return file;
}

function toBuffer(stream, cb) {
  let chunks = [];
  const readHandler = () => {
    let chunk = stream.read();
    while (chunk !== null) {
      chunks.push(chunk);
      chunk = stream.read();
    }
  };
  stream.on('readable', readHandler);
  stream.once('end', () => {
    stream.removeListener('readable', readHandler);
    return cb(new Buffer.concat(chunks).toString());
  });
}

function getFileContents(file, cb) {
  if (file.isStream()) {
    return toBuffer(file.contents, cb);
  } else if (file.isBuffer()) {
    return cb(file.contents);
  }
}

function displayValidationEntries(entries, type, color) {
  const indent = ' '.repeat(type.length + 1);
  entries.forEach(validationEntry => {
    let specPath = ['', ...validationEntry.path].join('/');
    if (specPath === '') specPath = '/';
    console.log(
      chalk[color](`${type}:`),
      chalk.bold(specPath),
      chalk.dim(validationEntry.code),
      `\n${indent}`,
      chalk.blue(validationEntry.message),
    );
    if (validationEntry.description) {
      console.log(`${indent}`, chalk.dim(validationEntry.description));
    }
  });
}

function displayValidationResults(results) {
  if (results.errors && results.errors.length) {
    displayValidationEntries(results.errors, 'error', 'red');
  }
  if (results.warnings && results.warnings.length) {
    displayValidationEntries(results.warnings, 'warning', 'yellow');
  }
}

export function concat(fileName) {
  let joinedContents = through();
  return through.obj((file, encoding, cb) => {
    if (file.isNull()) return cb(null, file);

    gutil.log(`Concatenating ${path.basename(file.path)}`);
    if (file.isStream()) {
      file.contents.pipe(joinedContents, {end: false});
    } else if (file.isBuffer()) {
      let stream = through();
      stream.write(file.contents);
      stream.pipe(joinedContents);
    }
    return cb();
  }, function(cb) {
    joinedContents.end();
    this.push(createFile(fileName, joinedContents));
    return cb();
  });
}

export function merge(name) {
  let joinedContents = {};
  return through.obj((file, encoding, cb) => {
    if (file.isNull()) return cb(null, file);
    getFileContents(file, (contents) => {
      let yamlContents = yaml.safeLoad(contents);
      let stem = path.basename(file.path, '.yaml');
      gutil.log(`Loading ${name} from ${stem}`);
      joinedContents[stem] = contents;
      return cb();
    });
  }, function(cb) {
    let stringContents = yaml.safeDump({[name]: joinedContents});
    this.push(createFile(`${name}.yaml`, new Buffer(stringContents)));
    return cb();
  });
}

export function validate() {
  return through.obj(function(file, encoding, cb) {
    if (file.isNull()) return cb(null, file);
    getFileContents(file, (contents) => {
      let definition = yaml.safeLoad(contents);
      sway.create({definition})
        .then((swagger) => {
          displayValidationResults(swagger.validate());
          this.push(file);
          return cb();
        }, (error) => {
          this.emit('error', error);
        });
    });
  });
}
