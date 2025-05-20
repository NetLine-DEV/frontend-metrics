import { AfterViewInit, Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CardsComponent } from '../../cards/cards.component';
import { initFlowbite } from 'flowbite';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { heroBoltSolid, heroCheckBadgeSolid, heroShieldCheckSolid } from '@ng-icons/heroicons/solid';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CardsComponent, NgIcon],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
  viewProviders: [
      provideIcons({ heroCheckBadgeSolid, heroBoltSolid, heroShieldCheckSolid }),
  ]
})
export class HomeComponent implements AfterViewInit {
  ngAfterViewInit(): void {
    initFlowbite();
  }

}
