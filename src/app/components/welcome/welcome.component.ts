import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-welcome',
  standalone: true,
  imports: [],
  templateUrl: './welcome.component.html',
  styleUrl: './welcome.component.css'
})
export class WelcomeComponent {
  @Input() pathImage: string = '';
  @Input() altImage: string = '';
  @Input() title: string = '';
  @Input() text: string = '';
}
