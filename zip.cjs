const fs = require('fs');
const archiver = require('archiver');

if (!fs.existsSync('public')) {
  fs.mkdirSync('public');
}

const output = fs.createWriteStream('public/source.zip');
const archive = archiver('zip', { zlib: { level: 9 } });

output.on('close', () => {
  console.log('Zip file created successfully: ' + archive.pointer() + ' total bytes');
});

archive.on('error', (err) => {
  console.error('Error creating zip:', err);
  process.exit(1);
});

archive.pipe(output);

// Include all files, but ignore node_modules, dist, and the zip file itself
archive.glob('**/*', {
  dot: true,
  ignore: ['node_modules/**', 'dist/**', 'public/source.zip', '.git/**']
});

archive.finalize();
