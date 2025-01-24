import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import * as bootstrap from 'bootstrap';
import { Modal } from 'bootstrap';
import { UserService } from 'src/app/Services/user.service';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent {
  userForm: FormGroup
  userList: any[] = [];
  showSubmit: boolean = true;
  showUpdate: boolean = false;
  userName: any;
  editIndex: number = -1;
  currentPage = 1;
  itemsPerPage = 10;
  sortColumn: string = '';
  sortDirection: 'asc' | 'desc' = 'asc';
  filterName: string = '';
  filteredUserList = [...this.paginatedUserList];


  @ViewChild('addUserModal') addUserModal!: ElementRef;
  @ViewChild('deleteUserModal') deleteUserModal!: ElementRef;

  constructor(private router: Router,
    private fb: FormBuilder,
    private userService: UserService
  ) {
    this.userForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      role: ['', Validators.required],
    });

  }

  ngOnInit() {
    this.userList = this.userService.getUsers();
  }
  get paginatedUserList() {
    let sortedList = [...this.userList];
    if (this.sortColumn) {
      sortedList.sort((a: any, b: any) => {
        const valueA = a[this.sortColumn] ? (a[this.sortColumn] as string).toLowerCase() : '';
        const valueB = b[this.sortColumn] ? (b[this.sortColumn] as string).toLowerCase() : '';
        if (valueA < valueB) return this.sortDirection === 'asc' ? -1 : 1;
        if (valueA > valueB) return this.sortDirection === 'asc' ? 1 : -1;
        return 0;
      });
    }
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return sortedList.slice(startIndex, endIndex);
  }

  changePage(page: number) {
    this.currentPage = page;
  }

  get totalPages() {
    return Math.ceil(this.userList.length / this.itemsPerPage);
  }

  sort(column: string) {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }
  }

  onSubmit(userForm: any) {
    if (userForm.valid) {
      if (this.showUpdate) {
        this.update(this.editIndex, userForm.value);
      } else {
        this.userService.addUser(this.userForm.value);
        this.userList = this.userService.getUsers();
        this.closeModal();
      }
    } else {
      console.log('Form is invalid');
    }
  }

  get name() {
    return this.userForm.get('name');
  }

  get email() {
    return this.userForm.get('email');
  }

  get role() {
    return this.userForm.get('role');
  }


  addUser() {
    this.showSubmit = true;
    this.showUpdate = false
    const modal = new bootstrap.Modal(this.addUserModal.nativeElement,
      {
        backdrop: 'static',
        keyboard: false,
      }
    );
    modal.show();
    this.userForm.reset();
  }

  closeModal() {
    const modal = new bootstrap.Modal(this.addUserModal.nativeElement,
      {
        backdrop: 'static',
        keyboard: false,
      }
    );
    modal.hide();
    this.userForm.reset();
  }

  editUser(index: number, updatedUser: any) {
    this.showSubmit = false;
    this.showUpdate = true;
    this.editIndex = index;
    const modal = new bootstrap.Modal(this.addUserModal.nativeElement,
      {
        backdrop: 'static',
        keyboard: false,
      }
    );
    modal.show();
    this.userForm.patchValue(updatedUser);
  }

  update(index: any, updatedUser: any) {
    this.userService.updateUser(index, updatedUser);
    this.userList = this.userService.getUsers();
  }

  deleteUser(index: number, user: any) {
    this.editIndex = index;
    this.userName = user.name;
    const modal = new bootstrap.Modal(this.deleteUserModal.nativeElement,
      {
        backdrop: 'static',
        keyboard: false,
      }
    );
    modal.show();
  }

  confirmDelete() {
    const modal = new bootstrap.Modal(this.deleteUserModal.nativeElement, {
      backdrop: 'static',
      keyboard: false,
    });
    modal.hide();    
    this.userService.deleteUser(this.editIndex);
    this.userList = this.userService.getUsers();
  }

  closeDeleteUserModal() {
    const modal = new bootstrap.Modal(this.deleteUserModal.nativeElement,
      {
        backdrop: 'static',
        keyboard: false,
      }
    );
    modal.hide();
  }

   filterData(): void {
    if (this.filterName) {
      this.filteredUserList = this.paginatedUserList.filter(user =>
        user.name.toLowerCase().includes(this.filterName.toLowerCase())
      );
    } else {
      this.filteredUserList = [...this.paginatedUserList];
    }
  }
}

