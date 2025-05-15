import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './button.component.html',
  styleUrl: './button.component.css'
})
export class ButtonComponent {
  @Input() text: string = '';
  @Input() colorText: string = '';
  @Input() height: string = '';
  @Input() type: string = '';
  @Input() action?: () => void;
  @Input() background: string = '';
  @Input() backgroundHover: string = '';
  @Input() disabled: boolean = false;
  @Input() loading: boolean = false;
}
