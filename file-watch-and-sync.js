const chokidar = require('chokidar');
const fs = require('fs').promises;
const path = require('path');

const srcFolder = '/Users/ndiahovets/Important Knowledge'; // Source folder
const destFolders = [
    '/Volumes/KINGSTON/Important Knowledge',
    '/Users/ndiahovets/Library/CloudStorage/OneDrive-Personal/Important Knowledge'
]; // Destination folders

// Function to sync file from source to destination
const syncFile = async (srcPath, destPath) => {
    try {
        await fs.cp(srcPath, destPath);
        console.log(`File copied`, {from: srcPath, to: destPath});
    } catch (e) {
        console.error('Error copying file:', e);
    }
};

const syncDir = async (srcPath, destPath) => {
    try {
        await fs.mkdir(destPath, {recursive: true});
        console.log(`Directory copied`, {from: srcPath, to: destPath});
    } catch (e) {
        console.error('Error making directory:', e);
    }
};

// Watcher
const watcher = chokidar.watch(srcFolder, {ignored: /(^|[\/\\])\../, persistent: true, ignoreInitial: true});

watcher
    .on('add', async (filePath) => { // New file added
        const relativePath = path.relative(srcFolder, filePath);
        for await (const destFolder of destFolders) {
            const destPath = path.join(destFolder, relativePath);
            await syncFile(filePath, destPath);
        }
    })
    .on('addDir', async (dirPath) => { // New dir added
        const relativePath = path.relative(srcFolder, dirPath);
        for await (const destFolder of destFolders) {
            const destPath = path.join(destFolder, relativePath);
            await syncDir(dirPath, destPath);
        }
    })
    .on('change', async (filePath) => { // File changed
        const relativePath = path.relative(srcFolder, filePath);
        for await (const destFolder of destFolders) {
            const destPath = path.join(destFolder, relativePath);
            await syncFile(filePath, destPath);
        }
    })
    .on('unlink', async (filePath) => { // File removed
        const relativePath = path.relative(srcFolder, filePath);
        for await (const destFolder of destFolders) {
            const destPath = path.join(destFolder, relativePath);
            try {
                await fs.unlink(destPath);
                console.log(`File deleted at ${destPath}`);
            } catch (e) {
                console.error('Error deleting file:', e);
            }
        }
    })
    .on('unlinkDir', async (filePath) => { // Directory removed
        const relativePath = path.relative(srcFolder, filePath);
        for await (const destFolder of destFolders) {
            const destPath = path.join(destFolder, relativePath);
            try {
                await fs.rm(destPath, {recursive: true, force: true});
                console.log(`Directory deleted at ${destPath}`);
            } catch (e) {
                console.error('Error deleting directory:', e);
            }
        }
    });


console.log('Watching for file changes...');