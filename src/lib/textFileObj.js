const fs = require('fs');

class obj { 
    static get(filePath) {
        const content = fs.readFileSync(filePath, 'utf-8');
        return this.makeStrIntoObject(content);
    }
    static makeStrIntoObject(str) {
        const lines = str.split("\n");
        let obj = {};
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i].split(/\s+/);
            if (line[0].length > 0) {
                this.createProp(obj, line);
            }
        }
        return obj;
    }
    static makeObjectIntoString(obj) {
        let fileContent = '';
        for (const prop in obj) {
            fileContent += `${prop}\t${obj[prop]}\n`;
        }
        return fileContent;
    }
    static createProp(obj, array) {
        const cleanArray = this.removeEmptyValues(array);
        if (cleanArray.length > 2) {
            obj[cleanArray[0]] = [];
            for (let i = 1; i < cleanArray.length; i++) {
                obj[cleanArray[0]].push(cleanArray[i]);
            }
        }
        else {
            obj[cleanArray[0]] = cleanArray[1];
        }
    }
    static removeEmptyValues(arr) {
        for (let i = 0; i < arr.length; i++) {
            if (arr[i] === '') {
                arr.splice(i, 1);
                i--;
            }
        }
        return arr;
    }

    //
    static findNameValue(path, value) {
        const content = fs.readFileSync(path, 'utf-8');
        const lines = content.split("\n");
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i].split(/\s+/);
            if (line[0] == value) {
                let returnStr = line[1];
                for (let j = 2; j < line.length - 2; j++) {
                    returnStr += "-" + line[j];
                }
                return returnStr;
            }
        }
        return false;
    }
    static findMachineGroup(path, dep, res) {
        const content = fs.readFileSync(path, 'utf-8');
        const lines = content.split("\n");
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i].split(/\s+/);
            if (line[0] == dep && line[1] == res) {
                return (line[2] == undefined) ? "null" : line[2];
            }
        }
        return false;
    }
}
 
export default obj;
