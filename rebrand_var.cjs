const fs = require('fs');
const path = require('path');

const walkSync = (dir, filelist = []) => {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const dirFile = path.join(dir, file);
    const dirent = fs.statSync(dirFile);
    if (dirent.isDirectory()) {
      filelist = walkSync(dirFile, filelist);
    } else {
      if (/\.(tsx|ts|html|json|md)$/.test(dirFile)) {
        filelist.push(dirFile);
      }
    }
  }
  return filelist;
};

const dirs = ['src', 'convex'];
let files = [];
dirs.forEach(d => {
  if (fs.existsSync(d)) {
    if (fs.statSync(d).isDirectory()) {
      files = walkSync(d, files);
    } else {
      files.push(d);
    }
  }
});

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let newContent = content;

  // Replace variable names
  newContent = newContent.replace(/nomorIndukMaarif/g, "nomorIndukPegawai");
  newContent = newContent.replace(/Nomor Induk Maarif/g, "Nomor Induk Pegawai");

  if (content !== newContent) {
    fs.writeFileSync(file, newContent, 'utf8');
    console.log("Updated variable in: " + file);
  }
});

console.log("Variable rebranding completed!");
