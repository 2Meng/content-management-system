const inquirer = require("inquirer");
const db = require("./server");


// checks for the employee if they exist specifying with their first name and last name
const getEmployee = async (fName, lName) => {
    try{
        const [rows] = await db.promise().query("SELECT * FROM employee WHERE first_name = ? AND last_name = ?", [fName, lName]);
    }
    catch(error){
        console.error(error);
        return false;
    };
};

// gets the data from the department table
const getDepartmentNames = () => {
    return db.promise().query("SELECT * FROM department")
    .then(([rows]) => {
        return rows.map((row) => row.name);
    })
    .catch((error) => {
        console.error(error);
        return [];
    });
};

// gets the data from the role table
const getRole = () => {
    return db.promise().query("SELECT * FROM roles")
    .then(([rows]) => {
        return rows.map((row) => row.title);
    })
    .catch((error) => {
        console.error(error);
        return [];
    });
};

const getManagerId = () => {
    return db.promise().query("SELECT first_name, last_name FROM employee WHERE manager_id is NULL")
    .then(([rows]) => {
        const manager = rows.map((row) => `${row.first_name} ${row.last_name}`);
        return [];
    });
};

const getDepartmentId = () => {
    
}




// initializes code and prompts the user with inquirer
function init(){
    inquirer
    .prompt([
        {
            name: "answer",
            type: "list",
            message: "What would you like to view?",
            choices: [ 
            "View all departments",
            "View all roles",
            "View all employees",
            "Add a department",
            "Add a role",
            "Add an employee",
            "Update an employee role",
            "Update employee's manager or change to manager status",
            "Quit",
            ]
        }
        .then((answer) => {
            console.log("Selected option: ", answer);
        })
        .catch((error) => {
            console.error("Error: ", error)
        })
    ])
}

init();