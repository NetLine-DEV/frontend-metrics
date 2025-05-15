import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TextFormComponent } from './text-form.component';

describe('TextFormComponent', () => {
  let component: TextFormComponent;
  let fixture: ComponentFixture<TextFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TextFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TextFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
