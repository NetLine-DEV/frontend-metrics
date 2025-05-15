import { Component, inject, OnInit } from '@angular/core';
import { InputsComponent } from '../../inputs/inputs.component';
import { ButtonComponent } from '../../button/button.component';
import { FormControl, FormGroup, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ResetPasswordService } from '../../../services/reset-password/reset-password.service';
import { passwordMatchValidator } from '../../../validators/passwordMatchValidator';

@Component({
  selector: 'app-confirm-reset-password',
  standalone: true,
  imports: [InputsComponent, ButtonComponent, ReactiveFormsModule, RouterLink],
  templateUrl: './confirm-reset-password.component.html',
  styleUrl: './confirm-reset-password.component.css'
})
export class ConfirmResetPasswordComponent implements OnInit {
  private formBuilderService = inject(NonNullableFormBuilder);
  private resetPasswordService = inject(ResetPasswordService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private toast = inject(ToastrService);
  
  private uidb64: string = '';
  private token: string = '';
  
  loading: boolean = false;
  
  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.uidb64 = params.get('uidb64') || '';
      this.token = params.get('token') || '';
    });
  }

  public form: FormGroup = this.formBuilderService.group({
    password: ['', [Validators.required, Validators.minLength(6)]],
    confirm_password: ['', [Validators.required, Validators.minLength(6)]],
  }, {validators: passwordMatchValidator});

  get passwordControl(): FormControl {
    return this.form.get('password') as FormControl;
  }

  get confirmPasswordControl(): FormControl {
    return this.form.get('confirm_password') as FormControl;
  }

  resetPassword(): void {
    this.form.markAllAsTouched();

    if (this.form.invalid) {
      return;
    }

    this.loading = true;

    this.resetPasswordService.resetPassword(this.form.value, this.uidb64, this.token).subscribe({
      next: () => {
        this.toast.success('Senha redefinida com sucesso!', 'Sucesso');
        this.router.navigate(['/login']);
      },
      error: (error) => {
        this.toast.error('Erro ao redefinir senha!', 'Erro');
        this.loading = false;
      },
      complete: () => {
        this.loading = false;
      }
    });
  }
}
