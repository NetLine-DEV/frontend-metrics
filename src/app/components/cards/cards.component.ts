import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-cards',
  standalone: true,
  imports: [],
  templateUrl: './cards.component.html',
  styleUrl: './cards.component.css'
})
export class CardsComponent {
  @Input() icon: string = '';
  @Input() altIcon: string = '';
  @Input() title: string = '';
  @Input() text: string = '';
  @Input() svg: string = '';
}
