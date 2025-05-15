import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-text-form',
  standalone: true,
  imports: [],
  templateUrl: './text-form.component.html',
  styleUrl: './text-form.component.css'
})
export class TextFormComponent {
  @Input() title: string = '';
}
