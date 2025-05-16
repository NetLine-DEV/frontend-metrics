import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputsComponent } from '../../../../inputs/inputs.component';
import { ButtonComponent } from '../../../../button/button.component';
import { UsersService } from '../../../../../services/users/users.service';
import { ActivatedRoute, Router } from '@angular/router';
import { IGroup } from '../../../../../models/group.model';
import { map, Observable } from 'rxjs';
import { GroupService } from '../../../../../services/groups/group.service';
import { ToastrService } from 'ngx-toastr';
import { IUser } from '../../../../../models/user.model';
import { UserInfoService } from '../../../../../services/user_info/user-info.service';
import { CardGroupComponent } from '../../../../card-group/card-group/card-group.component';

@Component({
  selector: 'app-edit-user',
  standalone: true,
  imports: [ButtonComponent, CommonModule, ReactiveFormsModule],
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.css']
})
export class EditUserComponent implements OnInit {
  private userService = inject(UsersService);
  private grouService = inject(GroupService);
  private formBuilderService = inject(NonNullableFormBuilder);
  private toast = inject(ToastrService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  groups$: Observable<IGroup[]> = new Observable<IGroup[]>();
  filteredGroups$: Observable<IGroup[]> = new Observable<IGroup[]>();

  user: IUser | null = null;
  userGroups: IGroup[] = [];
  availableGroups: IGroup[] = [];

  loading: boolean = false;

  form: FormGroup = this.formBuilderService.group({
    group_ids: [0, [Validators.required]]
  });

  ngOnInit(): void {
    this.groups$ = this.grouService.getGroups();
    this.filteredGroups$ = this.groups$;
    this.getUserInfo();
  }

  getUserInfo(): void {
    const userId = Number(this.route.snapshot.paramMap.get('id'));

    console.log('ID do usuário:', userId);

    this.userService.getUser(userId).subscribe({
      next: (response: IUser) => {
        this.user = response;
        this.userGroups = response.groups || [];
        this.updateAvailableGroups();
      },
      error: (error) => {
        console.error('Erro ao obter informações do usuário!', error);
      }
    })
  }

  updateAvailableGroups(): void {
    this.groups$.subscribe(groups => {
      this.availableGroups = groups.filter(group => !this.userGroups.some(userGroup => userGroup.group_id === group.group_id));
    });
  }

  addGroup(group: IGroup): void {
    if (!this.isGroupAdded(group)) {
      this.userGroups = [...this.userGroups, group];
      this.updateAvailableGroups();
    } else {
      this.removeGroup(group);
    }
  }

  removeGroup(group: IGroup): void {
    this.userGroups = this.userGroups.filter(userGroup => userGroup.group_id !== group.group_id);
    this.updateAvailableGroups();
  }

  isGroupAdded(group: IGroup): boolean {
    return this.userGroups.some(userGroup => userGroup.group_id === group.group_id) ?? false;
  }

  registerUserToGroup(): void {
    const userId = Number(this.route.snapshot.paramMap.get('id'));

    this.loading = true;

    if (this.form.invalid) {
      this.loading = false;
      return
    }

    const groupIds = this.userGroups.map(group => group.group_id);
    this.form.patchValue({ group_ids: groupIds });

    this.userService.addUserToGroup(this.form.value, userId).subscribe({
      next: () => {
        this.toast.success('Usuário vinculado ao grupo!', 'Sucesso');
        this.router.navigate(['/admin/users'])
        this.loading = false;
      },
      error: (error) => {
        this.toast.error('Erro ao vincular usuário ao grupo!', 'Erro');
        this.loading = false;
      },
      complete: () => {
        this.loading = false;
      }
    })
  }

  filterGroup(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    const value = inputElement.value;

    this.filteredGroups$ = this.groups$.pipe(
      map((groups: IGroup[]) => groups.filter((group: IGroup) =>
        group.name.toLowerCase().includes(value.toLowerCase())
      ))
    );
  }
}
