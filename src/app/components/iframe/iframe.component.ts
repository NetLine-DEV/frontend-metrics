import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-iframe',
  standalone: true,
  imports: [],
  templateUrl: './iframe.component.html',
  styleUrl: './iframe.component.css'
})
export class IframeComponent implements OnInit, OnDestroy {
  url: SafeResourceUrl = '';
  title: string = '';
  private routeSub: Subscription | null = null;

  constructor(private route: ActivatedRoute, private sanitizer: DomSanitizer) {}

  ngOnInit(): void {
    this.routeSub = this.route.paramMap.subscribe(paramMap => {
      const pageName = paramMap.get('pageName');
      if (pageName) {
        this.title = `Painel - ${pageName}`;
        this.url = this.sanitizer.bypassSecurityTrustResourceUrl(this.getUrlForPage(pageName));
      }
    });
  }
  ngOnDestroy(): void {
    if (this.routeSub) {
      this.routeSub.unsubscribe();
    }
  }

  getUrlForPage(pageName: string): string {
    const urlMap: { [key: string]: string } = {
      admin: 'https://app.powerbi.com/view?r=eyJrIjoiMGJkZWY4OTAtYjgwYi00N2JkLWEzZmYtOGNiNTUxN2UzOGFkIiwidCI6IjVjOTE1YmIwLTFhZWUtNDYzNy05ZTVkLTEwMjE1MWE1YjUyYSJ9',
      vendas: 'https://app.powerbi.com/view?r=eyJrIjoiNTQ1NDBhYjctNTYyNC00NjQzLWJhYzktOWM2M2Y1MDgzNjI5IiwidCI6IjVjOTE1YmIwLTFhZWUtNDYzNy05ZTVkLTEwMjE1MWE1YjUyYSJ9',
      cancelamentos: 'https://app.powerbi.com/view?r=eyJrIjoiZmFlZmNjZGMtNmY1MS00OWM5LTllN2EtODM1YmVkNzhhMWI5IiwidCI6IjVjOTE1YmIwLTFhZWUtNDYzNy05ZTVkLTEwMjE1MWE1YjUyYSJ9',
      atendimentos: 'https://app.powerbi.com/view?r=eyJrIjoiMDY3ZWI4Y2ItNWU0ZS00OWQ3LWI5NWUtYTEzZmViNmYxN2EwIiwidCI6IjVjOTE1YmIwLTFhZWUtNDYzNy05ZTVkLTEwMjE1MWE1YjUyYSJ9',
      financeiro: 'https://app.powerbi.com/view?r=eyJrIjoiNDljYjgxNzctMTM4OS00MWVkLThkMTktNDdjOGVjNDExMWQ3IiwidCI6IjVjOTE1YmIwLTFhZWUtNDYzNy05ZTVkLTEwMjE1MWE1YjUyYSJ9',
      planos: 'https://app.powerbi.com/view?r=eyJrIjoiMmIxOTA2MGMtYzZhYy00YjAzLWJjYTMtZGY5MzkxODBlYjM2IiwidCI6IjVjOTE1YmIwLTFhZWUtNDYzNy05ZTVkLTEwMjE1MWE1YjUyYSJ9'
    };
  
    const baseUrl = urlMap[pageName] || 'https://app.powerbi.com/';
    
    const params = '&filterPaneEnabled=false&navContentPaneEnabled=false&pageNavigationPosition=hidden';
    
    return `${baseUrl}${params}`;
  }
}
