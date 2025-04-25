const fs = require('fs');
const path = require('path');

const pkgPath = path.resolve('./package.json');
const overridesPath = path.resolve('./package-overrides.json');

const isProd = process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'prod';

const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));

console.log(pkgPath);

if (isProd) {
  if (pkg.overrides) {
    delete pkg.overrides;
    fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2));
    console.log('✅ Overrides removed for production');
  } else {
    console.log('ℹ️ No overrides found to remove.');
  }
} else {
  if (!fs.existsSync(overridesPath)) {
    console.error('❌ No package-overrides.json file found.');
    process.exit(1);
  }

  const overrides = JSON.parse(fs.readFileSync(overridesPath, 'utf-8'));

  pkg.overrides = {
    ...pkg.overrides,
    ...overrides,
  };

  fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2));
  console.log('✅ Dev overrides added to package.json');
}