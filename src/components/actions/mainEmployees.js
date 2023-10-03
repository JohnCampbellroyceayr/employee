import filePath from "../../lib/fileLocations";
import file from "../../lib/file";
import Time from "../../lib/time";
import obj from "../../lib/textFileObj";

class serverFiles {
    static create(number, name, status) {
        const path = filePath("currentEmployees");
        const currentEmployees = file.getFileNames(path);
        if (this.numberDoesNotExist(number, currentEmployees)) {
            const newEmployee = this.getContentNewEmployee(number, name, status);
            file.createFile(path + number + ".txt", obj.makeObjectIntoString(newEmployee));
            delete newEmployee["CurrentMachine"];
            return newEmployee;
        }
        else {
            console.log("Already exists");
            const newEmployee = obj.get(path + number + ".txt");
            delete newEmployee["CurrentMachine"];
            return newEmployee;
        }
    }
    static numberDoesNotExist(number, array) {
        for (let i = 0; i < array.length; i++) {
            const name = array[i].split(".")[0];
            if (name == number) {
                return false;
            }                        
        }
        return true;
    }
    static getContentNewEmployee(number, name, status) {
        const object = {};
        object["Number"] = number;
        object["Name"] = name;
        object["Status"] = status;
        object["LastChanged"] = Time.getTime();
        object["CurrentMachine"] = "null";
        return object;
    }
    static changeStatus(number, newStatus) {
        const path = filePath("currentEmployees");
        const currentEmployees = file.getFileNames(path);
        if (!this.numberDoesNotExist(number, currentEmployees)) {
            const textFilePath = path + number + ".txt";
            console.log("asdf");
            if (newStatus != "End Shift") {
                const employee = obj.makeStrIntoObject(file.read(textFilePath));
                employee["Status"] = newStatus;         
                file.createFile(textFilePath, obj.makeObjectIntoString(employee));
            }
            else {
            console.log("asdf");

                file.delete(textFilePath);
            }
        }
    }
    static getEmployee(number) {
        const path = filePath("currentEmployees");
        const currentEmployees = file.getFileNames(path);
        if (!this.numberDoesNotExist(number, currentEmployees)) {
            const newEmployee = obj.get(path + number + ".txt");
            delete newEmployee["CurrentMachine"];
            return newEmployee;
        }
        return false;
    }
    static exists(number) {
        const path = filePath("currentEmployees");
        const currentEmployees = file.getFileNames(path);
        if (this.numberDoesNotExist(number, currentEmployees)) {
            return false;
        }
    }
}
 
export default serverFiles;