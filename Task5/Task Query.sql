
#Query to get Average salary (Department wise)
select r.Name as RoleName,Avg(e.Salary)as EmployeeSalary 
from Employees e inner join Roles r on e.RoleId = r.RoleId 
where r.Name = 'Content Creating Lead'
group by r.RoleId 


#Query to get hierarchy of a person by Role Name
select 
r.Name  ,e.Name from
Employees e 
inner join Roles r on e.RoleId  = r.RoleId 
left join Roles r2 on r.ParentId = r2.RoleId
where r2.Name = 'Journalist'


#Query to get herarchy of complete organization
select 
r.Name  ,e.Name from
Employees e 
inner join Roles r on e.RoleId  = r.RoleId 
left join Roles r2 on r.ParentId = r2.RoleId





   