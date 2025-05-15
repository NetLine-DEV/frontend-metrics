import { Component, inject, OnInit } from '@angular/core';
import { UsersService } from '../../../../../services/users/users.service';
import { map, Observable } from 'rxjs';
import { IUser } from '../../../../../models/user.model';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { IGroup } from '../../../../../models/group.model';
import { GroupService } from '../../../../../services/groups/group.service';
import { initFlowbite } from 'flowbite';

@Component({
  selector: 'app-list-users',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './list-users.component.html',
  styleUrl: './list-users.component.css'
})
export class ListUsersComponent implements OnInit {
  private userService = inject(UsersService);
  private groupService = inject(GroupService);
  private toast = inject(ToastrService);
  
  public users$: Observable<IUser[]> = new Observable<IUser[]>();
  public groups$: Observable<IGroup[]> = new Observable<IGroup[]>();
  public selectedUser: IUser | null = null;
  public selectedGroup: IGroup | null = null;
  public selectedStatus: string | null = null;
  public nameFilter: string = '';
  public showModal: boolean = false;

  ngOnInit(): void {
    initFlowbite();
    this.users$ = this.userService.getUsers();
    this.groups$ = this.groupService.getGroups().pipe(
      map(groups => groups.filter(group => group.is_active))
    );
  }

  filterUsersByGroup(group: IGroup | null): void {
    this.selectedGroup = group;
    this.applyFilters();
  }

  filterUsersByStatus(status: string | null): void {
    this.selectedStatus = status;
    this.applyFilters();
  }

  filterUserByUsername(event: Event): void {
    const input = event.target as HTMLInputElement;
    const term = input?.value || '';
    this.nameFilter = term.trim();
    this.applyFilters();
  }

  applyFilters(): void {
    this.users$ = this.userService.getUsers().pipe(
      map(users => {
        if (this.selectedGroup) {
          users = users.filter(user => user.groups.some(g => g.group_id === this.selectedGroup!.group_id));
        }
        if (this.selectedStatus !== null) {
          users = users.filter(user => user.is_active === (this.selectedStatus === 'active'));
        }

        if (this.nameFilter.trim() !== '') {
          const searchTerm = this.nameFilter.trim().toLowerCase();
          users = users.filter(user => user.username.toLowerCase().includes(searchTerm));
        }
        return users;
      })
    );
  }

  openModal(user: IUser): void {
    this.selectedUser = user;
    this.showModal = true;
  }

  closeModal(): void {
    this.selectedUser = null;
    this.showModal = false;
  }

  deactivateUser(): void {
    if (this.selectedUser) {
      this.userService.deactivateUser(this.selectedUser, this.selectedUser.id).subscribe({
        next: () => {
          this.toast.success('Usuário deletado com sucesso!', 'Sucesso');
          this.users$ = this.userService.getUsers().pipe(
            map(users => users.filter(user => user.is_active))
          );
          this.closeModal();
        },
        error: (error) => {
          this.toast.error('Erro ao deletar usuário!', 'Erro');
        }
      });
    }
  }

}
