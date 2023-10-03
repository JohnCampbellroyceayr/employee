const fs = require('fs');
// const path = require('path');

class file {
    static getFileNames(folderPath) {
        try {
            const fileNames = fs.readdirSync(folderPath);
            return fileNames;
        } catch (error) {
            console.error('Error reading files:', error);
            return [];
        }
    }
    static read(path) {
        return fs.readFileSync(path, 'utf-8');
    }
    static createFile(fileName, content) {
        fs.writeFileSync(fileName, content, (err) => {
            if (err) {
                console.error(err);
                return;
            }
        });
    }
    static addToFile(path, newline) {
        try {
          const content = fs.readFileSync(path, 'utf8');
          const updatedContent = newline + '\n' + content;
          fs.writeFileSync(path, updatedContent, 'utf8');
        } catch (error) {
          console.error('Error adding line to file:', error);
        }
    }
    static delete(path) {
        fs.unlinkSync(path);
    }
}

export default file;