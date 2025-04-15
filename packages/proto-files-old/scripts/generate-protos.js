const { spawnSync } = require('child_process');
const result = spawnSync(
  './node_modules/.bin/protoc', // Adjust path if needed
  [
    '--plugin=protoc-gen-grpc=./node_modules/.bin/grpc_node_plugin',
    '--plugin=protoc-gen-ts=./node_modules/.bin/protoc-gen-ts',
    '--ts_out=src/generated',
    '--js_out=import_style=commonjs,binary:src/generated',
    '--grpc_out=grpc_js:src/generated',
    '--proto_path=./proto',
    'proto/user.proto'
  ],
  { stdio: 'inherit' }
);
if (result.error) {
  console.error('❌ Failed to generate protos:', result.error);
  process.exit(1);
}