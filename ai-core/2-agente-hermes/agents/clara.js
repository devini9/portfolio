const { google } = require('googleapis');
const path = require('path');
const fs = require('fs');

const auth = new google.auth.GoogleAuth({
  keyFile: path.join(__dirname, '../google-credentials.json'),
  scopes: ['https://www.googleapis.com/auth/drive.readonly'],
});

const CV_FILE_ID = '13y7Ny8UlX3TpwI7_JXO-aouCOBb9m-f8';

async function downloadCV(outputDir) {
  const drive = google.drive({ version: 'v3', auth });
  const destPath = path.join(outputDir, 'curriculo.pdf');
  
  const dest = fs.createWriteStream(destPath);
  
  return new Promise(async (resolve, reject) => {
    try {
      const res = await drive.files.get(
        { fileId: CV_FILE_ID, alt: 'media' },
        { responseType: 'stream' }
      );
      
      res.data
        .on('end', () => {
          resolve();
        })
        .on('error', err => {
          reject(err);
        })
        .pipe(dest);
    } catch (err) {
      reject(err);
    }
  });
}

module.exports = { downloadCV };
