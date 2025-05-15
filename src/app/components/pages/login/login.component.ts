import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { InputsComponent } from '../../inputs/inputs.component';
import { ButtonComponent } from '../../button/button.component';
import { WelcomeComponent } from '../../welcome/welcome.component';
import { TextFormComponent } from '../../text-form/text-form.component';
import { FormGroup, NonNullableFormBuilder, ReactiveFormsModule, Validators, FormControl } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../../services/auth/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [InputsComponent, ButtonComponent, WelcomeComponent, TextFormComponent, RouterLink, CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  public pathImage: string = '/assets/images/metrics-login.png';
  public altImage: string = 'Imagem de uma folha de métricas';
  public title: string = 'Bem-vindo ao <br> Painel de Análise Integrada!';
  public text: string = 'Acesse sua conta e acompanhe os principais indicadores do seu negócio <br> com facilidade e segurança.';

  private formBuilderService = inject(NonNullableFormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private toast = inject(ToastrService);
  loading: boolean = false;

  public form: FormGroup = this.formBuilderService.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  get emailControl(): FormControl {
    return this.form.get('email') as FormControl;
  }

  get passwordControl(): FormControl {
    return this.form.get('password') as FormControl;
  }

  public login(): void {
    this.form.markAllAsTouched();
    
    if (this.form.invalid) {
      return;
    }
    
    this.loading = true;

    const formGroup = this.form.value;
    this.authService.login(formGroup).subscribe({
      next: () => {
        this.router.navigate(['/']);
      },
      error: () => {
        this.toast.error('Erro nas credenciais!', 'Erro');
        this.loading = false;
      },
      complete: () => {
        this.loading = false;
      }
    });
  }
}
