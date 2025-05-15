import { Component, inject } from '@angular/core';
import { InputsComponent } from '../../inputs/inputs.component';
import { ButtonComponent } from '../../button/button.component';
import { FormControl, FormGroup, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ResetPasswordService } from '../../../services/reset-password/reset-password.service';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [InputsComponent, ButtonComponent, ReactiveFormsModule, RouterLink],
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent {
  private formBuilderService = inject(NonNullableFormBuilder);
  private resetPasswordService = inject(ResetPasswordService);
  private router = inject(Router);
  private toast = inject(ToastrService);
  loading: boolean = false;

  public form: FormGroup = this.formBuilderService.group({
    email: ['', [Validators.required, Validators.email]]
  });

  get emailControl(): FormControl {
    return this.form.get('email') as FormControl;
  }

  sendMailResetPassword(): void {
    this.form.markAllAsTouched();
    
    if (this.form.invalid) {
      return;
    }


    this.loading = true;

    this.resetPasswordService.sendMail(this.form.value).subscribe({
      next: () => {
        this.toast.success('Email de redefinição de senha enviado!', 'Sucesso');
        this.disableFormControls();
      },
      error: (error) => {
        this.toast.error('Erro ao enviar email!', 'Erro');
        this.loading = false;
      },
      complete: () => {
        this.loading = false;
      }
    });
  }

  private disableFormControls(): void {
    this.form.reset();
    this.form.controls['email'].disable();
  }

  isButtonDisabled(): boolean {
    return this.form.invalid || this.form.controls['email'].disabled;
  }
}
