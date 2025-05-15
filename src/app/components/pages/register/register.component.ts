import { Component, inject } from '@angular/core';
import { InputsComponent } from '../../inputs/inputs.component';
import { ButtonComponent } from '../../button/button.component';
import { WelcomeComponent } from '../../welcome/welcome.component';
import { TextFormComponent } from '../../text-form/text-form.component';
import { Router, RouterLink } from '@angular/router';
import { FormControl, FormGroup, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { RegisterUserService } from '../../../services/register/register-user.service';
import { passwordMatchValidator } from '../../../validators/passwordMatchValidator';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [InputsComponent, ButtonComponent, WelcomeComponent, TextFormComponent, RouterLink, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  public pathImage: string = '/assets/images/metrics-register.png';
  public altImage: string = 'Imagem de um gráfico de métricas';
  public title: string = 'Crie sua conta e conecte-se ao <br> sucesso!';
  public text: string = 'Cadastre-se e comece a monitorar os principais indicadores do seu <br> negócio com eficiência e precisão.';

  private formBuilderService = inject(NonNullableFormBuilder);
  private registerService = inject(RegisterUserService);
  private router = inject(Router);
  private toast = inject(ToastrService);
  loading: boolean = false;

  public form: FormGroup = this.formBuilderService.group({
    username: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    repeat_password: ['', [Validators.required, Validators.minLength(6)]]
  }, {validators: passwordMatchValidator});

  get usernameControl(): FormControl {
    return this.form.get('username') as FormControl;
  }

  get emailControl(): FormControl {
    return this.form.get('email') as FormControl;
  }

  get passwordControl(): FormControl {
    return this.form.get('password') as FormControl;
  }

  get repeatPasswordControl(): FormControl {
    return this.form.get('repeat_password') as FormControl;
  }

  public register(): void {
    this.form.markAllAsTouched();
    
    if (this.form.invalid) {
      return;
    }
    
    this.loading = true;

    const formGroup = this.form.value;
    this.registerService.registerUser(formGroup).subscribe({
      next: () => {
        this.toast.success('Usuário cadastrado com sucesso!', 'Sucesso');
        this.router.navigate(['/login']);
      },
      error: (error) => {
        this.loading = false;
        if (error.status === 400) {
          this.toast.error('Erro de validação. Verifique os dados e tente novamente.', 'Erro');
        } else {
          this.toast.error('Erro ao cadastrar usuário. Tente novamente mais tarde.', 'Erro');
        }
      },
      complete: () => {
        this.loading = false;
      }
    });
  }
}
