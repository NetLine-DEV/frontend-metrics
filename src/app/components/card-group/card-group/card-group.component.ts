import { NgFor, NgIf } from '@angular/common';
import { IGroup } from './../../../models/group.model';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-card-group',
  standalone: true,
  imports: [NgFor, NgIf],
  templateUrl: './card-group.component.html',
  styleUrl: './card-group.component.css'
})
export class CardGroupComponent {
  @Input() group: IGroup = { group_id: 0, name: '', permissions: [], is_active: true };
  @Input() add!: (group: IGroup) => void;
  @Input() remove!: (group: IGroup) => void;
  @Input() isGroupAdded!: (group: IGroup) => boolean;
}
