// const fs = require('fs').promises;
// const path = require('path');
//
// async function getDirectoryStructure(dir, prefix = '') {
//     const entries = await fs.readdir(dir, { withFileTypes: true });
//     const results = [];
//
//     for (const entry of entries) {
//         if (entry.name.startsWith(".")) continue;
//         const fullPath = path.join(dir, entry.name);
//         const relativePath = path.join(prefix, entry.name);
//
//         if (entry.isDirectory()) {
//             const subDirStructure = await getDirectoryStructure(fullPath, relativePath);
//             results.push(...subDirStructure);
//         } else {
//             results.push(relativePath);
//         }
//     }
//
//     return results;
// }
//
// async function compareDirectories(dir1, dir2) {
//     const structure1 = await getDirectoryStructure(dir1);
//     const structure2 = await getDirectoryStructure(dir2);
//
//     const structureSet1 = new Set(structure1);
//     const structureSet2 = new Set(structure2);
//
//     const inFirstOnly = structure1.filter(x => !structureSet2.has(x));
//     const inSecondOnly = structure2.filter(x => !structureSet1.has(x));
//
//     return { inFirstOnly, inSecondOnly };
// }
//
// (async () => {
//     const dir1 = '/Users/ndiahovets/Important Knowledge';
//     const dir2 = '/Volumes/KINGSTON/Important Knowledge';
//
//     const { inFirstOnly, inSecondOnly } = await compareDirectories(dir1, dir2);
//
//     console.log('In first directory only:', inFirstOnly);
//     console.log('In second directory only:', inSecondOnly);
//
//     if (inFirstOnly.length === 0 && inSecondOnly.length === 0) {
//         console.log('The directory structures are identical.');
//     } else {
//         console.log('The directory structures are different.');
//     }
// })();