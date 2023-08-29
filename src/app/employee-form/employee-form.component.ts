import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Employee } from '../employee';
import { EmployeeService } from '../employee.service';

@Component({
  selector: 'app-employee-form',
  templateUrl: './employee-form.component.html',
  styleUrls: ['./employee-form.component.css']
})
export class EmployeeFormComponent implements OnInit {
  employeeForm: FormGroup;
  designations = ['Manager', 'IT Manager', 'Developer'];
  isUpdateMode = false;
  employeeToUpdate: Employee | undefined;

  constructor(
    private fb: FormBuilder,
    private employeeService: EmployeeService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.employeeForm = this.fb.group({
      id: [0, Validators.required],
      name: ['', Validators.required],
      designation: ['', Validators.required],
      salary: ['', Validators.required],
      created_at: '',
      updated_at: ''
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const employeeId = +params['id'];
      if (employeeId) {
        this.isUpdateMode = true;
        this.employeeToUpdate = this.employeeService.readById(employeeId);
        if (this.employeeToUpdate) {
          this.employeeForm.get('designation')?.setValue(this.employeeToUpdate.designation);
          this.employeeForm.patchValue(this.employeeToUpdate);
          this.employeeForm.get('designation')?.setValue(this.employeeToUpdate.designation);
        }
      }
    });
  }

  onSubmit(): void {
    const employee: Employee = this.employeeForm.value;
    if (this.isUpdateMode && this.employeeToUpdate) {
      employee.created_at = this.employeeToUpdate.created_at;
      this.employeeService.update(employee);
    } else {
      this.employeeService.create(employee);
    }

    this.employeeForm.reset({
      id: 0,
      name: '',
      designation: '',
      salary: '',
      created_at: '',
      updated_at: ''
    });
    
    this.router.navigate(['/employees']);
  }

  onReset(): void {
    this.employeeForm.reset();
  }
}
