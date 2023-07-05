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
        returnToMenu();
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
const addRole = async () => {
    try {
      // Get the departments from the database
      const departments = await getDepartment();
  
      inquirer
        .prompt([
          {
            name: "title",
            type: "input",
            message: "What is the title of the role?",
          },
          {
            name: "salary",
            type: "input",
            message: "What is the salary of the role?",
          },
          {
            name: "departmentName",
            type: "list",
            message: "What department is this role in?",
            choices: departments.map((department) => department.name),
          },
        ])
        .then(async (answers) => {
          try {
            // Find the department with the selected name
            const selectedDepartment = departments.find(
              (department) => department.name === answers.departmentName
            );
  
            // Insert the role into the database with the department ID
            await db.query(
              `INSERT INTO role (title, salary, department_id) VALUES ('${answers.title}', '${answers.salary}', '${selectedDepartment.id}')`
            );
  
            console.log("Role added successfully.");
          } catch (error) {
            console.log("An error occurred when trying to add a role: ", error);
          }
  
          returnToMenu();
        });
    } catch (error) {
      console.log("An error occurred while fetching departments: ", error);
      returnToMenu();
    }
  };

const updateEmployeeRole = () => {
    inquirer
    .prompt([
        {
            name: "firstName",
            title: "input",
            message: "What is the employees first name?"
        },
        {
            name: "lastName",
            title: "input",
            message: "What is the employees last name?"
        },
        {
            name: "newRole",
            title: "input",
            message: "What is the employees new role?"
        }
    ])
    .then( async (answers) => {
        try{
            const [employee] = await db.query(
                "SELECT * FROM employee WHERE first_name = ? AND last_name = ?",
                [answers.firstName, answers.lastName]
              );
      
              if (employee.length === 0) {
                console.log("Employee does not exist. Please try again.");
                init();
                return;
              }
      
              const [role] = await db.query(
                "SELECT id FROM role WHERE title = ?",
                [answers.newRole]
              );
      
              if (role.length === 0) {
                console.log("Role does not exist. Please try again.");
                init();
                return;
              }
      
              await db.query(
                "UPDATE employee SET role_id = ? WHERE first_name = ? AND last_name = ?",
                [role[0].id, answers.firstName, answers.lastName]
              );
      
              console.log("Employee role updated successfully.");
        }
        catch (error) {
            console.log("An error occurred when updating the employee role: ", error);
        }
        returnToMenu();
    });
};

const updateManager = () => {
    inquirer
    .prompt([
        {
            name: "firstName",
            type: "input",
            message: "What is the employees/managers first name?"
        },
        {
            name: "lastName",
            type: "input",
            message: "What is the employees/managers last name?"
        },
        {
            name: "managerId",
            type: "input",
            message: "What is the employees/managers id?"
        }
    ])
    .then( async (answers) => {
        try{
            const [employee] = await db.query(
                "SELECT * FROM employee WHERE manager_id = ?",
                [answers.firstName, answers.lastName]
              );
      
              if (employee.length === 0) {
                console.log("Manager does not exist. Please try again.");
                init();
                return;
              }

              await db.query(
                "UPDATE employee SET manager_id = ? WHERE first_name = ? AND last_name = ?",
                [managerExists[0].id, answers.firstName, answers.lastName]
              );
      
              console.log("Employee role updated successfully.");
        }
        catch (error) {
            console.log("An error occurred when updating the employee role: ", error);
        }
        returnToMenu();
    });
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
            "Update manager or change employee to manager status",
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
                    updateEmployeeRole();
                    break;
                case "Update manager or change employee to manager status":
                    updateManager();
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