import React, { Component } from 'react';
import obj from '../lib/textFileObj.js';
import Menu from './subcomponents/valuesMenu.jsx';
import file from '../lib/file.js'
import Time from '../lib/time.js'
import './subcomponents/styling/employee.css'

import filePath from '../lib/fileLocations.js';
import menu from './subcomponents/valuesMenu.jsx';
import serverFiles from './actions/mainEmployees.js';


class employeeValues extends Component {
    state = {
        Employee: obj.get(filePath("employeeLocal")),
        menus: [
            {id: 0, text: null, class: 'default', hidden: true, ref: React.createRef()},
            {id: 1, text: null, class: 'default', hidden: true, ref: React.createRef()},
            {id: 2, text: "not used", class: 'default', hidden: true},
            {id: 3, text: null, class: 'default', hidden: true, ref: React.createRef()},
            {id: 4, text: null, class: 'default', hidden: true, ref: React.createRef()},
        ],
        buttons: [
            {id: 0, class: 'action', text: "Start Shift"},
            {id: 1, class: 'action', text: "Leave For Break"},
            {id: 2, class: 'action', text: "Return From break", onclick: () => {this.logAction("End Break", "Working"); this.closeMenus()} },
            {id: 3, class: 'action', text: "Employee Sign out"},
            {id: 4, class: 'action', text: "Switch Employee"},
        ]
    }
    componentDidMount() {
        if (!serverFiles.exists(this.state.Employee["Number"])) {
            this.changeEmployeeToNextLoggedInUser();
        }
        this.updateMenus();
    }
    updateMenus = () => {
        this.setState(prevState => {
            const menus = [...prevState.menus];
            const buttons = [...prevState.buttons];
            const status = prevState.Employee["Status"];
            console.log(status);
            buttons[0].disabled = (status == undefined || status == "undefined" || status == "Shift-Not-Started") ? false : true;
            buttons[1].disabled = (status == "Working") ? false : true;
            buttons[2].disabled = (status == "On-Break") ? false : true;
            buttons[3].disabled = (status != undefined && status != "undefined") ? false : true;
            buttons[4].disabled = (status != undefined && status != "undefined") ? false : true;
            menus[0].text = this.startShiftMenu(0);
            menus[1].text = this.breakMenu(1);
            menus[3].text = this.signOutMenu(3);
            menus[4].text = this.renderEmployeeMenu(menus[4].ref);
            return { menus: menus, buttons: buttons};
        });
    }
    keypressInputStartShiftEmployee = (e) => {
        if (e.keyCode === 13) {
            this.createNewEmployee(e.target.value)
            e.target.value = "";
        }
    }
    startShiftMenu(index) {
        const emp = this.state.Employee;
        if (emp["Status"] == "Shift-Not-Started") {
            const text = (<h2>Start Shift Employee { emp["Number"] + " " + this.removeDashesFromText(emp["Name"]) }?</h2>);
            const button = (<button ref={this.state.menus[index].ref} className='pick-menu' onClick={() => {this.startShiftLoggedInEmployee(); this.closeMenus()}}>Start Shift</button>);
            return (
                <>
                    {text}<br></br>
                    {button}<br></br>
                </>
            );
        }
        else {
            const text = (<h2>Enter employee</h2>);
            const input = <input type="text" ref={this.state.menus[index].ref} onKeyDown={(e) => this.keypressInputStartWorkingNewShift(e)}/>
            return (
                <>
                    {text}<br></br>
                    {input}<br></br>
                </>
            );
        }
    }
    breakMenu(index) {
        const text = (<h2>Set Employee {this.removeDashesFromText(this.state.Employee["Name"])} to break? (Enter for yes)</h2>);
        const yesBtn = (<button onClick={() => {this.logAction("Start Break", "On-Break"); this.closeMenus()}} ref={this.state.menus[index].ref} className='pick-menu'>Yes</button>);
        const noBtn = (<button onClick={() => {this.closeMenus()}} className='pick-menu'>No</button>);
        return (
            <>
                {text}<br></br>
                {yesBtn}
                {noBtn}
            </>
        )
    }
    signOutMenu(index) {
        const messageNoMachinesRunning = (<h2>Log out Employee {this.removeDashesFromText(this.state.Employee["Name"])}?) (Enter for yes)</h2>);
        const messageMachineRunning = (<div>Warning, you are still logged in to at least one machine, including </div>)
        const yesBtn = (<button onClick={() => {this.logAction("End Shift", "SwitchUser"); this.closeMenus();}} ref={this.state.menus[index].ref} className='pick-menu'>Yes</button>);
        const noBtn = (<button onClick={() => {this.closeMenus()}} className='pick-menu'>No</button>);
        const warningMessageMachinesStillRunning = serverFiles.deleteMessage(this.state.Employee["Number"]);
        const message = (warningMessageMachinesStillRunning == false) ? messageNoMachinesRunning : (
            <>
                {messageMachineRunning}
                {warningMessageMachinesStillRunning}<br></br>
                Do you still want to logout?<br></br>
                If you forgot to logout, select "No" or "Cancel", close this window, open the machine menu and logout the machine(s) there.
            </>
        );
        return (
            <>
                {message}<br></br>
                {yesBtn}
                {noBtn}
            </>
        )
    }
    logAction = (message, setStatus) => {
        const employee = this.state.Employee["Number"];
        let writeString = employee + '\t' + message + '\t' + Time.getDateTime();
        file.addToFile(filePath("employeeLog"), writeString);
        if (setStatus != undefined) {
            if (setStatus != "SwitchUser") {
                this.setState(prevState => {
                    const emp = prevState.Employee;
                    serverFiles.changeStatus(emp["Number"], setStatus);
                    emp["Status"] = setStatus;
                    emp["LastChanged"] = Time.getTime();
                    return { Employee: emp };
                }, () => {
                    this.updateMenus();
                });
            }
            else {
                if (message == "End Shift") {
                    serverFiles.changeStatus(employee, "End Shift");
                }
                this.changeEmployeeToNextLoggedInUser();
            }
        }
    }

    changeEmployeeToNextLoggedInUser = () => {
        const files = this.filterFileNames(file.getFileNames(filePath("employeeLocalDir")));
        if (files.length > 0 || (this.state.Employee["Number"] != undefined && this.state.Employee["Number"] != "undefined")) {
            console.log(files);
            var index;
            
            const currentFile = this.state.Employee["Number"] + ".txt";
            try {
                this.switchEmployee(files[0].replace(".txt", ""));
                file.delete(filePath("employeeLocalDir") + currentFile);
            }
            catch {
                this.setState(prevState => {
                    const employee = {};
                    employee["Number"] = 'undefined';
                    employee["Name"] = 'undefined';
                    employee["Status"] = 'undefined';
                    employee["LastChanged"] = 'undefined';
                    this.save(employee, filePath("employeeLocal"))
                    return { Employee: employee };
                }, () => {
                    this.updateMenus();
                });
            }
        }
        else {
            this.setState(prevState => {
                const employee = prevState.Employee;
                employee["Number"] = '';
                employee["Name"] = '';
                employee["Status"] = '';
                employee["LastChanged"] = '';
                return { Employee: employee };
            }, () => {
                this.save(this.state.Employee, filePath("employeeLocal"));
                this.setState({ Employee: obj.get(filePath("employeeLocal")) });
                console.log(this.state.Employee);
                this.updateMenus();
            });
        }
    }

    startShiftLoggedInEmployee = () => {
        this.setState(prevState => {
            const newEmployee = prevState.Employee;
            newEmployee["Status"] = "Working";
            newEmployee["LastChanged"] = Time.getTime();    
            serverFiles.changeStatus(newEmployee["Number"], "Working");
            return { Employee: newEmployee };
        }, () => {

            const employee = this.state.Employee;
            this.save(employee, filePath("employeeLocal"));
            const machine = obj.get(filePath("machineLocal"))["Machine"];
            let writeString = employee["Number"] + '\t' + "Start Shift" + '\t' + Time.getDateTime();
            writeString = employee["Number"] + '\t' + "Started on" + '\t' + machine + '\t' + Time.getDateTime() + '\n' + writeString;
            file.addToFile(filePath("employeeLog"), writeString);
            
            this.updateMenus();
        });
    }

    closeMenus = () => {
        this.setState(prevState => {
            const menus = [...this.state.menus];
            menus.forEach(menu => {
                menu.hidden = true;
            });            
            return { menus: menus };
        });
    }
    keypressInputStartWorkingNewShift = (e) => {
        if (e.keyCode === 13) {
            if (e.target.value.length > 1) {
                if(this.createNewEmployeeAndStartShift(e.target.value)) {
                    this.closeMenus();
                }
                e.target.value = "";
            }
        }
    }
    keypressInputSwitchEmployee = (e) => {
        if (e.keyCode === 13) {
            if (e.target.value.length > 1) {
                if(this.createNewEmployee(e.target.value)) {
                    this.closeMenus();
                }
                e.target.value = "";
            }
        }
    }
    save = (employeeObj, filePath) => {
        let fileContent = '';
        for (const prop in employeeObj) {
            fileContent += `${prop}\t${employeeObj[prop]}\n`;
        }
        file.createFile(filePath, fileContent);
    }

    switchEmployee = (number) => {
        this.saveCurrentEmployee();
        const newEmployee = serverFiles.getEmployee(number);
        if (newEmployee != false) {
            this.save(newEmployee, filePath("employeeLocal"));
            this.setState({ Employee: newEmployee }, () => {
                this.updateMenus();
            });
        }
    }
    //asdf
    createNewEmployeeAndStartShift = (employeeNumber) => {
        const employeeName = obj.findNameValue(filePath("employeeList"), employeeNumber);
        if (employeeName !== false) {
            this.saveCurrentEmployee();

            const newEmployee = serverFiles.create(employeeNumber, employeeName, "Working");

            this.save(newEmployee, filePath("employeeLocal"));
            const employee = newEmployee["Number"];


            const machine = obj.get(filePath("machineLocal"))["Machine"];
            let writeString = employee + '\t' + "Start Shift" + '\t' + Time.getDateTime();
            writeString = employee + '\t' + "Started on" + '\t' + machine + '\t' + Time.getDateTime() + '\n' + writeString;
            file.addToFile(filePath("employeeLog"), writeString);

            this.setState({ Employee: newEmployee }, () => {
                this.updateMenus();
            });
            return true;
        }
        else {
            alert("Employee Number not found!");
        }
    }
    createNewEmployee = (employeeNumber) => {
        const employeeName = obj.findNameValue(filePath("employeeList"), employeeNumber);
        if (employeeName !== false) {
            this.saveCurrentEmployee();
            let newEmployee = {};
            newEmployee["Number"] = employeeNumber;
            newEmployee["Name"] = employeeName;
            newEmployee["Status"] = "Shift-Not-Started";
            newEmployee["LastChanged"] = Time.getTime();
            this.save(newEmployee, filePath("employeeLocal"));
            
            serverFiles.create(employeeNumber, employeeName, newEmployee["Status"]);
            
            this.setState({ Employee: newEmployee }, () => {
                this.updateMenus();
            });
            return true;
        }
        else {
            alert("Employee Number not found!");
        }
    }
    filterFileNames = (files) => {
        for (let i = 0; i < files.length; i++) {
            const name = files[i].split(".")[0];
            if((name == "employee-data-macro" || name == "employee" || name == this.state.Employee["Number"]) || (serverFiles.exists(name) == false)) {
                files.splice(i, 1);
                i--;
            }            
        }
        return files;
    }
    saveCurrentEmployee = () => {
        if (this.state.Employee["Number"] != undefined && this.state.Employee["Number"] != "null") {
            const fileName = this.state.Employee["Number"] + ".txt";
            this.save(this.state.Employee, filePath("employeeLocalDir") + fileName);
        }
    }
    

    removeDashesFromText(text) {
        if (text != undefined && text != "undefined") {
            return text.replaceAll("-", " ");
        }
        return '';
    }

    renderEmployeeMenu(ref) {
        const files = this.filterFileNames(file.getFileNames(filePath("employeeLocalDir")));
        const employeeMenu = files.map(file => {
            const employeeObj = obj.get(filePath("employeeLocalDir") + file);
            const number = employeeObj["Number"];
            const name = employeeObj["Name"];
            if (number != undefined) {
                return (<div onClick={() => this.switchEmployee(employeeObj["Number"])}>{number}{" "}{this.removeDashesFromText(name)}</div>)
            }
            else {
                return '';
            }
        });
        return (
            <div>
                <br></br>
                Enter new employee<br></br>
                <input type='text' onKeyDown={(e) => this.keypressInputSwitchEmployee(e)} ref={ref}></input><br></br>
                or select other employee
                <div className='chooseOtherEmployeeMenu'>
                    {employeeMenu}
                </div>
            </div>
        );
    }
    render() {
        const employee = this.state.Employee;
        return (
            <h2>
                Employee<br></br>
                {this.removeDashesFromText(employee["Number"])}
                {" "}
                {this.removeDashesFromText(employee["Name"])} <br></br>
                {"Status: "}
                {this.removeDashesFromText(employee["Status"])}<br></br>
                <br></br>
                <Menu 
                    menus={this.state.menus}
                    buttons={this.state.buttons}
                />
                <br></br>
                <br></br>
                <button onClick={() => {window.close()}} className='pick-menu'>Close</button>
            </h2>
        );
    }
}
 
export default employeeValues;