// const fs = require('fs').promises;
// const path = require('path');
//
// async function getDirectoryContent(dir, prefix = '') {
//     const entries = await fs.readdir(dir, { withFileTypes: true });
//     let results = [];
//
//     for (const entry of entries) {
//         const fullPath = path.join(dir, entry.name);
//         const relativePath = path.join(prefix, entry.name);
//
//         if (entry.isDirectory()) {
//             const subDirContent = await getDirectoryContent(fullPath, relativePath);
//             results = results.concat(subDirContent);
//         } else {
//             const stats = await fs.stat(fullPath);
//             results.push({
//                 path: relativePath,
//                 mtime: stats.mtime.getTime()
//             });
//         }
//     }
//
//     return results;
// }
//
// async function copyFile(source, destination) {
//     const destDir = path.dirname(destination);
//     await fs.mkdir(destDir, { recursive: true });
//     await fs.copyFile(source, destination);
// }
//
// async function removeEmptyDirectories(directoryPath) {
//     const entries = await fs.readdir(directoryPath, { withFileTypes: true });
//
//     for (const entry of entries) {
//         if (entry.isDirectory()) {
//             const subdirPath = path.join(directoryPath, entry.name);
//             await removeEmptyDirectories(subdirPath);
//         }
//     }
//
//     const updatedEntries = await fs.readdir(directoryPath, { withFileTypes: true });
//     if (updatedEntries.length === 0) {
//         await fs.rmdir(directoryPath);
//         console.log(`Deleted empty directory: ${directoryPath}`);
//     }
// }
//
// async function synchronizeFolders(sourceDir, destinationDir) {
//     const sourceContent = await getDirectoryContent(sourceDir);
//     const destinationContent = await getDirectoryContent(destinationDir);
//
//     const destContentMap = new Map(destinationContent.map(entry => [entry.path, entry]));
//
//     for (const entry of sourceContent) {
//         const sourcePath = path.join(sourceDir, entry.path);
//         const destinationPath = path.join(destinationDir, entry.path);
//         const destEntry = destContentMap.get(entry.path);
//
//         if (!destEntry || destEntry.mtime < entry.mtime) {
//             // If the file doesn't exist in the destination or is modified, copy it
//             await copyFile(sourcePath, destinationPath);
//             console.log(`Copied: ${entry.path}`);
//         }
//         destContentMap.delete(entry.path);
//     }
//
//     // Optionally, remove files from destination that are not present in source
//     for (const remainingEntry of destContentMap.keys()) {
//         const filePath = path.join(destinationDir, remainingEntry);
//         await fs.unlink(filePath);
//         console.log(`Deleted: ${remainingEntry}`);
//     }
//
//     // Remove empty directories
//     await removeEmptyDirectories(destinationDir);
// }
//
// (async () => {
//     const sourceDir = '/Users/ndiahovets/Important Knowledge';
//     const destinationDir = '/Volumes/KINGSTON/Important Knowledge';
//
//     await synchronizeFolders(sourceDir, destinationDir);
//     // const result = await fs.readdir("/Volumes/KINGSTON/Important Knowledge", {withFileTypes: true})
//     // console.log(result)
//
//     console.log('Folders synchronized');
// })();