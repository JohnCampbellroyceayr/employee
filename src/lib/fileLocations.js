export default function filePath(locationName) {

    switch (locationName) {
        case "machineMacro":
            return files.curPath + files.macroFile;
            break;
        case "machineLocal":
            return files.curPath + files.machineFile;
            break;
        case "machineLocalDir":
            return files.curPath + files.machineFileDir;
            break;
        case "machineGroup":
            return files.curPathServer + files.machineGroupFile;
            break;
        case "employeeLocal":
            return files.curPath + files.employeeFile;
            break;
        case "employeeLocalDir":
            return files.curPath + files.employeeFileDir;
            break;
        case "employeeList":
            return files.curPathServer + files.employeeList;
            break;
        case "employeeLog":
            return files.curPathServer + files.employeeLog;
            break;
        case "currentEmployees":
            return files.curPathServer + files.employeeCurrentLoggedIn
        default:
            break;
    }
}
var path = require('path'); path.dirname(process.execPath);
var files = {
    //just do a ./
    // curPath: path.dirname(path.dirname(global.__dirname)),
    curPath: 'C:\\Users\\John Campbell\\AppData\\Roaming\\IBM\\Client Access\\Emulator\\private',
    curPathServer: '\\\\192.168.0.13\\Engdrawing\\Inspection Logs\\Scanning Files',
    macroFile: '\\local files\\machine\\machine-data-macro.txt',
    machineFile: '\\local files\\machine\\machine.txt',
    machineFileDir: '\\local files\\machine\\',
    machineGroupFile: '\\machines\\MachineGroups.txt',
    employeeFile: '\\local files\\employee\\employee.txt',
    employeeFileDir: '\\local files\\employee\\',
    employeeList: '\\employees\\EmployeeList.txt',
    employeeLog: '\\employees\\EmployeeLog.txt',
    employeeCurrentLoggedIn: '\\employees\\Current Employees\\'
}

