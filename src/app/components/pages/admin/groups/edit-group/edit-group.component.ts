import { AfterContentInit, Component, inject, OnInit } from '@angular/core';
import { InputsComponent } from '../../../../inputs/inputs.component';
import { ButtonComponent } from '../../../../button/button.component';
import { FormArray, FormGroup, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { PermissionService } from '../../../../../services/permissions/permission.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { IPermission } from '../../../../../models/permission.model';
import { map, Observable } from 'rxjs';
import { IGroup } from '../../../../../models/group.model';
import { GroupService } from '../../../../../services/groups/group.service';
import { nonEmptyArrayValidator } from '../../../../../validators/nomEmptyArrayValidator';

@Component({
  selector: 'app-edit-group',
  standalone: true,
  imports: [InputsComponent, ButtonComponent, CommonModule, ReactiveFormsModule],
  templateUrl: './edit-group.component.html',
  styleUrl: './edit-group.component.css'
})
export class EditGroupComponent implements OnInit, AfterContentInit {
  private permissionsService = inject(PermissionService);
  private groupService = inject(GroupService);
  private formBuilderService = inject(NonNullableFormBuilder);
  private toast = inject(ToastrService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  permissions$: Observable<IPermission[]> = new Observable<IPermission[]>();
  filteredPermissions$: Observable<IPermission[]> = new Observable<IPermission[]>();

  loading: boolean = false;

  form: FormGroup = this.formBuilderService.group({
    name: ['', [Validators.required, Validators.minLength(5)]],
    permissions: this.formBuilderService.array([], [nonEmptyArrayValidator()])
  });

  ngOnInit(): void {
    this.permissions$ = this.permissionsService.getPermissions();
    this.filteredPermissions$ = this.permissions$;
  }

  ngAfterContentInit(): void {
    this.getInfoGroup();
  }

  get permissions(): FormArray {
    return this.form.get('permissions') as FormArray;
  }

  getInfoGroup(): void {
    const groupId = Number(this.route.snapshot.paramMap.get('id'));

    this.groupService.getGroup(groupId).subscribe({
      next: (response: IGroup) => {
        this.form.patchValue({
          name: response.name
        });

        this.permissions.clear();

        response.permissions.forEach(permission => {
          this.permissions.push(this.formBuilderService.control(permission.id));
        });

        this.filteredPermissions$ = this.permissions$.pipe(
          map(permissions => permissions.sort((a, b) => {
            const aAdded = this.isPermissionAdded(a);
            const bAdded = this.isPermissionAdded(b);
            return aAdded === bAdded ? 0 : aAdded ? -1 : 1;
          }))
        );
      },
      error: (error) => {
        console.error('Erro ao obter informações do usuário!', error);
      }
    })
  }

  filterPermission(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    const value = inputElement.value;

    this.filteredPermissions$ = this.permissions$.pipe(
      map(permissions => permissions.filter(permission => 
        permission.name.toLowerCase().includes(value.toLowerCase())
      )),
      map(permissions => permissions.sort((a, b) => {
        const aAdded = this.isPermissionAdded(a);
        const bAdded = this.isPermissionAdded(b);
        return aAdded === bAdded ? 0 : aAdded ? -1 : 1;
      }))
    );    
  }

  addPermission(permission: IPermission): void {
    const permissionExists = this.permissions.controls.some(control => control.value.id === permission.id);

    if (!permissionExists) {
      this.permissions.push(this.formBuilderService.control(permission.id));
    } else {
      this.removePermission(permission);
    }
  }

  removePermission(permission: IPermission): void {
    const index = this.permissions.controls.findIndex(control => control.value === permission.id);
    if (index !== -1) {
      this.permissions.removeAt(index);
    }
  }

  isPermissionAdded(permission: IPermission): boolean {
    return this.permissions.controls.some(control => control.value === permission.id);
  }

  editGroup(): void {
    const groupId = Number(this.route.snapshot.paramMap.get('id'));

    if (this.form.invalid) {
      this.toast.warning('Necessário inserir permissão ao grupo!', 'Alerta')
      return;
    }

    this.loading = true;

    this.groupService.editGroup(this.form.value, groupId).subscribe({
      next: () => {
        this.toast.success('Grupo editado com sucesso!', 'Sucesso');
        this.loading = false;
        this.router.navigate(['/admin/groups']);
        this.form.reset();
        this.permissions.clear();
      },
      error: (error) => {
        this.toast.error('Erro ao editar grupo!', 'Erro');
        this.loading = false;
      },
      complete: () => {
        this.loading = false;
      }
    })
  }
}
