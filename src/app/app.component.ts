import { Component, inject, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { initFlowbite } from 'flowbite';
import { NgIf } from '@angular/common';
import { HeaderComponent } from './components/header/header.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'metrics_bi';
  currentRoute: string = '';

  router = inject(Router);

  ngOnInit(): void {
    initFlowbite();

    this.router.events.subscribe((event: any) => {
      if (event instanceof NavigationEnd) {
        this.currentRoute = event.url;
      }
    });
  }

  verifyRoute(): boolean {
    return ['/login', '/register', '/reset-password', '/unauthorized'].some(route => this.currentRoute.startsWith(route));
  }
}
