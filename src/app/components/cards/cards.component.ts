import { Component, Input } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { heroChartBarSolid, heroClockSolid, heroEyeSolid } from '@ng-icons/heroicons/solid';

@Component({
  selector: 'app-cards',
  standalone: true,
  imports: [NgIcon],
  templateUrl: './cards.component.html',
  styleUrl: './cards.component.css',
  viewProviders: [
    provideIcons({ heroClockSolid, heroChartBarSolid, heroEyeSolid }),
  ]
})
export class CardsComponent {
  @Input() icon: string = '';
  @Input() altIcon: string = '';
  @Input() title: string = '';
  @Input() text: string = '';
  @Input() svg: string = '';
}
