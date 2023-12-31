INSERT INTO department (name)
VALUES 
('Administration'),
('Facilities'),
('IT'),
('Finance'),
('Legal'),
('Marketing'),
('Sales'),
('Human Resources');

INSERT INTO role (id, title, salary, department_id)
VALUES  
(1, 'Chief Executive Officer', 300000, 1),
(2, 'Chief Technology Officer', 200000, 3),
(3, 'Chief Marketing Officer', 100000, 6),
(4, 'Chief Finance Officer', 50000, 4),
(5, 'Chief Legal Officer', 100000, 5),
(6, 'Chief Facilities Manager', 50000, 2),
(7, 'Chief Sales Officer', 100000, 7),
(8, 'Chief Human Resources Officer', 50000, 8),
(9, 'CEO Assistant', 50000, 1),
(10, 'IT Assistant', 50000, 3),
(11, 'Marketing Assistant', 50000, 6),
(12, 'Finance Assistant', 50000, 4),
(13, 'Legal Assistant', 50000, 5),
(14, 'Facilities Assistant', 50000, 2),
(15, 'Sales Assistant', 50000, 7),
(16, 'Human Resources Assistant', 50000, 8);

INSERT INTO employee (id, first_name, last_name, role_id, manager_id)
VALUES  
(101, 'Mack', 'McKnife', 5, NULL),
(102, 'Maggie', 'Pie', 4, NULL),
(103, 'Scott', 'Free', 8, NULL),
(105, 'Post', 'Malone', 2, NULL),
(106, 'Elon', 'Bezos', 1, NULL),
(107, 'Angela', 'Alegna', 3, NULL),
(110, 'Mike', 'Mulligan', 6, NULL),
(113, 'Rocky', 'Horror', 5, 101),
(118, 'Macon', 'Bank', 7, NULL),
(104, 'Rainn', 'Showers', 16, 103),
(108, 'Pat', 'Peartree', 12, 102),
(111, 'Calcifer', 'Starscream', 11, 107),
(112, 'The', 'Rock', 14, 110),
(114, 'Michael', 'Angelo', 10, 105),
(115, 'Jerry', 'Sanchez', 11, 107),
(116, 'Noelle', 'DeFenestra', 9, 106),
(117, 'Aida', 'Sforzando', 15, 118),
(109, 'Anna', 'Notherwon', 15, 118);