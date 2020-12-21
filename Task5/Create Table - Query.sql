-- task.Employees definition

CREATE TABLE `Employees` (
  `EmployeeId` varchar(255) NOT NULL,
  `Name` varchar(80) NOT NULL,
  `RoleId` varchar(255) DEFAULT NULL,
  `Salary` decimal(18,2) DEFAULT NULL,
  PRIMARY KEY (`EmployeeId`),
  KEY `RoleId` (`RoleId`),
  CONSTRAINT `employees_ibfk_1` FOREIGN KEY (`RoleId`) REFERENCES `Roles` (`RoleId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


-- task.Roles definition

CREATE TABLE `Roles` (
  `RoleId` varchar(255) NOT NULL,
  `Name` varchar(80) DEFAULT NULL,
  `ParentId` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`RoleId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;