import { Component, inject, OnInit } from '@angular/core';
import { InputsComponent } from '../../../../inputs/inputs.component';
import { CommonModule } from '@angular/common';
import { FormGroup, FormArray, FormControl, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { PermissionService } from '../../../../../services/permissions/permission.service';
import { Observable } from 'rxjs';
import { IPermission } from '../../../../../models/permission.model';
import { ButtonComponent } from '../../../../button/button.component';
import { ToastrService } from 'ngx-toastr';
import { map } from 'rxjs/operators';
import { GroupService } from '../../../../../services/groups/group.service';
import { Router } from '@angular/router';
import { nonEmptyArrayValidator } from '../../../../../validators/nomEmptyArrayValidator';

@Component({
  selector: 'app-create-group',
  standalone: true,
  imports: [InputsComponent, ButtonComponent, CommonModule, ReactiveFormsModule],
  templateUrl: './create-group.component.html',
  styleUrl: './create-group.component.css'
})
export class CreateGroupComponent implements OnInit {
  private permissionsService = inject(PermissionService);
  private groupService = inject(GroupService);
  private formBuilderService = inject(NonNullableFormBuilder);
  private toast = inject(ToastrService);
  private router = inject(Router);
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

  get permissions(): FormArray {
    return this.form.get('permissions') as FormArray;
  }

  filterPermission(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    const value = inputElement.value;

    this.filteredPermissions$ = this.permissions$.pipe(
      map(permissions => permissions.filter(permission => 
        permission.name.toLowerCase().includes(value.toLowerCase())
      ))
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

  registerGroup(): void {
    if (this.form.invalid) {
      this.toast.warning('Necessário inserir permissão ao grupo!', 'Alerta')
      return;
    }

    this.loading = true;

    this.groupService.postGroup(this.form.value).subscribe({
      next: () => {
        this.toast.success('Grupo cadastrado com sucesso!', 'Sucesso');
        this.loading = false;
        this.router.navigate(['/admin/groups']);
        this.form.reset();
        this.permissions.clear();
      },
      error: (error) => {
        this.toast.error('Erro ao cadastrar grupo: ' + error.error.name, 'Erro');
        this.loading = false;
      },
      complete: () => {
        this.loading = false;
      }
    })
  }
}
