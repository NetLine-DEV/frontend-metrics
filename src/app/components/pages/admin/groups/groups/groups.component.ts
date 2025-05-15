import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, inject, OnInit } from '@angular/core';
import { GroupService } from '../../../../../services/groups/group.service';
import { Router, RouterLink } from '@angular/router';
import { map, Observable } from 'rxjs';
import { IGroup } from '../../../../../models/group.model';
import { ToastrService } from 'ngx-toastr';
import { initFlowbite } from 'flowbite';

@Component({
  selector: 'app-groups',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './groups.component.html',
  styleUrl: './groups.component.css'
})
export class GroupsComponent implements OnInit, AfterViewInit {
  private groupService = inject(GroupService);
  private toast = inject(ToastrService);
  private router = inject(Router);

  groups$: Observable<IGroup[]> = new Observable<IGroup[]>();
  selectedGroup: IGroup | null = null;
  showModal: boolean = false;

  ngOnInit(): void {
    this.groups$ = this.groupService.getGroups().pipe(
      map(groups => groups.filter(group => group.is_active))
    );
  }

  ngAfterViewInit(): void {
    initFlowbite();
  }

  openModal(group: IGroup): void {
    this.selectedGroup = group;
    this.showModal = true;
  }

  closeModal(): void {
    this.selectedGroup = null;
    this.showModal = false;
  }

  deleteGroup(): void {
    if (this.selectedGroup) {
      this.groupService.deactivateGroup(this.selectedGroup, this.selectedGroup.group_id).subscribe({
        next: () => {
          this.toast.success('Grupo deletado com sucesso!', 'Sucesso');
          this.groups$ = this.groupService.getGroups().pipe(
            map(groups => groups.filter(group => group.is_active))
          );
          this.closeModal();
        },
        error: (error) => {
          this.toast.error('Erro ao deletar grupo!', 'Erro');
          console.error('Erro ao deletar grupo!', error);
        }
      });
    }
  }

  deactivateGroup(group: IGroup, id: number): void {
    this.groupService.deactivateGroup(group, id).subscribe({
      next: () => {
        this.toast.success('Grupo removido com sucesso', 'Sucesso');
      },
      error: (error) => {
        this.toast.error('Erro ao remover grupo', 'Erro');
      }
    })
  }
}
