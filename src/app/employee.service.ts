import { Injectable } from '@angular/core';
import { Employee } from './employee';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  private employees: Employee[] = [];

  constructor() {
    const storedEmployees = localStorage.getItem('employees');
    if (storedEmployees) {
      this.employees = JSON.parse(storedEmployees);
    }
  }

  private saveToLocalStorage(): void {
    localStorage.setItem('employees', JSON.stringify(this.employees));
  }

  create(employee: Employee): void {
    employee.id = this.employees.length + 1;
    employee.created_at = new Date().toISOString();
    employee.updated_at = new Date().toISOString();
    this.employees.push(employee);
    this.saveToLocalStorage();
  }

  readAll(): Employee[] {
    return this.employees.sort((a, b) => b.id - a.id); // Sort in descending order by id
  }

  readById(id: number): Employee | undefined {
    return this.employees.find(employee => employee.id === id);
  }

  update(employee: Employee): void {
    const index = this.employees.findIndex(e => e.id === employee.id);
    if (index !== -1) {
      employee.updated_at = new Date().toISOString();
      this.employees[index] = employee;
      this.saveToLocalStorage();
    }
  }

  delete(id: number): void {
    const index = this.employees.findIndex(e => e.id === id);
    if (index !== -1) {
      this.employees.splice(index, 1);
      this.saveToLocalStorage();
    }
  }
}
