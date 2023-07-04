const inquirer = require("inquirer");
const db = require("./server");
const consoleTable = require("console.table");

// asks the user if they want to return to the menu
const returnToMenu = () => {
    inquirer
      .prompt([
        {
          name: "returnToMenu",
          type: "confirm",
          message: "Return to the menu?",
          default: true
        }
      ])
      .then((answer) => {
        if (answer.returnToMenu) {
          init(); // Return to the menu
        } else {
          process.exit(0); // Exit the program
        }
      })
      .catch((error) => {
        console.error("Error: ", error);
      });
  };

const getEmployee = async () => {
    try{
        const [employee] = await db.query("SELECT * FROM employee")
        console.table(employee)
        getManager();
    }
    catch(error){
        console.log(error)
    }
}  

// gets the data from the department table
const getDepartment = async () => {
    try{
        const [departments] = await db.query("SELECT * FROM department")
        console.table(departments)
        return departments;
    }
    catch(error){
        console.log(error)
    }
    returnToMenu();
}    

// gets the data from the role table
const getRole = () => {
    return db.query("SELECT * FROM role")
    .then(([rows]) => {
        console.table(rows)
        returnToMenu()
    })
    .catch((error) => {
        console.error(error);
        return [];
    })
};

const getManager = () => {
    inquirer
    .prompt([
        {
            name: "manager",
            type: "confirm",
            message: "Get manager information?",
            default: true
        }
        ])
        .then((answer) => {
            if(answer.manager){
                return db.query("SELECT first_name, last_name FROM employee WHERE manager_id is NULL")
            } else {
                process.exit(0);
            }
        })
        .then(([rows]) => {
            const manager = rows.map((row) => `${row.first_name} ${row.last_name}`);
            returnToMenu();
            return manager;
        })
        .catch((error) => {
            console.error(error);
            return [];
        })
}

// adds department to the employee_db 
const addDepartment = async () => {
    inquirer
    .prompt([
        {
            name: "department",
            type: "input",
            message: "Add department"
        }
    ])
    .then( async (answer)  => {
        try{
            const [rows] = await db.query(`INSERT INTO department(name) VALUES('${answer.department}')`);
            getDepartment();
        }
        catch(error){
            console.error(error);
            return false;
        };
    })
};

// adds employee to the employee_db 
const addEmployee = async () => {
    inquirer
            .prompt([
            {
                name: "firstName",
                type: "input",
                message: "Add employee first name."
            },
            {
                name: "lastName",
                type: "input",
                message: "Add employee last name."
            },
            {
                name: "role",
                message: "What is the employee's role?",
                type: "list",
                choices: () =>
                    db
                    .query("SELECT * FROM role")
                    .then(([rows]) => rows.map((role) => role.title)),
                },
            ])
            .then(async (answers) => {
                try{
                const [rows] = await db.query(`INSERT INTO employee (first_name, last_name, role) VALUES ('${answers.firstName}', '${answers.lastName}', '${answers.role}')`);
                console.table = rows;
                getEmployee();
                }
                catch(error){
                    console.error(error);
                    return false;
                }
            })
};

// adds role to the employee_db
const addRole = () => {
    inquirer
    .prompt([
        {
            name: "title",
            type: "input",
            message: "What is the title of the role?"
        },
        {
            name: "salary",
            type: "input",
            message: "What is the salary of the role?"
        },
        {
            name: "department",
            type: "list",
            message: "What department is this role in?",
            choices: async () => {
                try {
                    const departments = await getDepartment(); // Assuming getDepartment() is an asynchronous function that fetches departments
                    return departments.map(department => department.name);
                } catch (error) {
                    console.log("An error occurred while fetching departments: ", error);
                    return []; // Return an empty array as choices if there's an error
                }
            }
        }
    ])
    .then( async (answers) => {
        try {
            await db.query(`INSERT INTO role (title, salary, department) VALUES ('${answers.title}', '${answers.salary}', '${answers.department}')`);
        }
        catch(error) {
            console.log("An error was encountered when trying to add role: ", error);
        }
    })
};

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
    ])
        .then((answer) => {
            switch (answer.answer) {
                case "View all departments":
                    getDepartment();
                    break;
                case "View all roles":
                    getRole();
                    break;
                case "View all employees":
                    getEmployee();
                    break;
                case "Add a department":
                    addDepartment();
                    break;
                case "Add a role":
                    addRole();
                    break;
                case "Add an employee":
                    addEmployee();
                    break;
                case "Update an employee role":
                    break;
                case "Update employee's manager or change to manager status":
                    break;
                default:
                    process.exit(0);
            }
        })
        .catch((error) => {
            console.error("Error: ", error)
        })
}

init();