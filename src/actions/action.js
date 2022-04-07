module.exports = {
  init (id, defaultLicense) {
    this.id = id;
    this.defaultLicense = defaultLicense;
  },
  getLicense () {
    return this.license ?? this.defaultLicense;
  }
};
