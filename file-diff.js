const fs = require('fs');
const path = require('path');

// Function to get list of files in a directory recursively
const getFilesInDirectory = (dirPath, baseDir = '') => {
  return new Promise((resolve, reject) => {
    fs.readdir(dirPath, (err, items) => {
      if (err) {
        reject(err);
      } else {
        let files = [];
        let promises = [];
        items.forEach(item => {
          const fullPath = path.join(dirPath, item);
          const relativePath = path.join(baseDir, item);
          promises.push(new Promise((res, rej) => {
            fs.stat(fullPath, (err, stats) => {
              if (err) {
                rej(err);
              } else {
                if (stats.isDirectory()) {
                  getFilesInDirectory(fullPath, relativePath).then(subFiles => {
                    files = files.concat(subFiles);
                    res();
                  }).catch(rej);
                } else {
                  files.push(relativePath);
                  res();
                }
              }
            });
          }));
        });

        Promise.all(promises).then(() => resolve(files)).catch(reject);
      }
    });
  });
};

// Function to get the difference between two arrays
const getDifference = (arr1, arr2) => {
  const set1 = new Set(arr1);
  const set2 = new Set(arr2);

  const difference = [...set1].filter(item => !set2.has(item));
  return difference;
};

// Function to sync differences from source folder to destination folder
const syncDifferences = (srcFolder, destFolder, differences) => {
  differences.forEach(file => {
    const srcPath = path.join(srcFolder, file);
    const destPath = path.join(destFolder, file);
    const destDir = path.dirname(destPath);

    // Ensure the destination directory exists
    fs.mkdirSync(destDir, { recursive: true });

    // Copy the file
    console.log(`Copying \n`, {from: srcPath, to: destPath});
    fs.copyFileSync(srcPath, destPath);
    // console.log(`Copied\n`, {from: srcPath, to: destPath});
  });
};

// Main function to check differences between two folders
const checkFolderDifferences = async (folderPath1, folderPath2) => {
  try {
    const filesInFolder1 = await getFilesInDirectory(folderPath1);
    const filesInFolder2 = await getFilesInDirectory(folderPath2);

    // console.log('Files in', folderPath1, ':', filesInFolder1);

    const difference1 = getDifference(filesInFolder1, filesInFolder2);
    const difference2 = getDifference(filesInFolder2, filesInFolder1);

    console.log(`Files in \n${folderPath1} \nbut not in \n${folderPath2}: \n`, difference1);
    console.log(`Files in \n${folderPath2} \nbut not in \n${folderPath1}: \n`, difference2);

    // // Sync differences from folderPath1 to folderPath2
    // syncDifferences(folderPath1, folderPath2, difference1);
    // // Sync differences from folderPath2 to folderPath1
    // syncDifferences(folderPath2, folderPath1, difference2);
  } catch (err) {
    console.error('Error reading directories:', err);
  }
};

// Example usage
const folder1 = '/Users/ndiahovets/Important Knowledge';
const folder2 = '/Users/ndiahovets/Library/CloudStorage/OneDrive-Personal/Important Knowledge';

checkFolderDifferences(folder1, folder2);
