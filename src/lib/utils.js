export function ExtendableBuiltin(cls) {
  function ExtendableBuiltin(...args) { // eslint-disable-line no-shadow
    Reflect.apply(cls, this, args);
  }
  ExtendableBuiltin.prototype = Object.create(cls.prototype);
  Reflect.setPrototypeOf(ExtendableBuiltin, cls);

  return ExtendableBuiltin;
}

export function noop() {}
