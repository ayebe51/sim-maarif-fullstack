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

const dirs = ['src', 'vite.config.ts', 'package.json', 'index.html'];
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

  // Exact phrases
  newContent = newContent.replace(/Lembaga Pendidikan Ma'arif NU Cilacap/gi, "Platform EduSaaS");
  newContent = newContent.replace(/Pimpinan Cabang LP Ma'arif NU Kab\. Cilacap/gi, "Platform EduSaaS Terpusat");
  newContent = newContent.replace(/LP Ma'arif NU Cilacap/gi, "Platform EduSaaS");
  newContent = newContent.replace(/LP Ma'arif NU/gi, "Platform EduSaaS");
  newContent = newContent.replace(/MI Ma'arif 01 Cilacap/gi, "SD Harapan Bangsa");
  newContent = newContent.replace(/MI Ma'arif NU 01 Cilacap/gi, "SD Harapan Bangsa");
  
  // NIP
  newContent = newContent.replace(/Nomor Induk Ma'arif/gi, "Nomor Induk Pegawai");
  newContent = newContent.replace(/NIM Ma'arif/gi, "NIP / ID");
  newContent = newContent.replace(/NIP \/ Nomor Induk Ma'arif/gi, "NIP \/ ID Pegawai");

  // General Ma'arif to Pegawai if it refers to ID, or just EduSaaS
  newContent = newContent.replace(/Ma'arif Cilacap/gi, "EduSaaS");
  newContent = newContent.replace(/Ma'arif NU Cilacap/gi, "EduSaaS");
  newContent = newContent.replace(/Ma'arif NU/gi, "EduSaaS");
  newContent = newContent.replace(/Ma'arif/gi, "EduSaaS");

  newContent = newContent.replace(/Sistem Informasi Manajemen Madrasah Cilacap \(SIMMACI\)/gi, "Sistem Absensi Sekolah (EduSaaS)");
  newContent = newContent.replace(/SIMMACI/gi, "EduSaaS");
  newContent = newContent.replace(/Cilacap/gi, "Pusat");

  if (content !== newContent) {
    fs.writeFileSync(file, newContent, 'utf8');
    console.log("Updated: " + file);
  }
});

console.log("Rebranding completed!");
