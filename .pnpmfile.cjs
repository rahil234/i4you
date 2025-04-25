function readPackage(pkg, context) {
  if (pkg.name === 'express-logr') console.log(pkg);
  return pkg;
}

// context.log('readPackage', pkg.name);
// if (process.env.NODE_ENV === 'production') return pkg;
// if (pkg.overrides) {
//   console.log(`Removing workspace overrides from ${pkg.name}`);
//   Object.keys(pkg.overrides).forEach((pkgName) => {
//     if (pkg.overrides[pkgName] === 'workspace:*') {
//       delete pkg.overrides[pkgName];
//     }
//   });
// }

function updateConfig(config) {
  return config;
}

module.exports = {
  hooks: {
    readPackage,
    updateConfig,
  },
};