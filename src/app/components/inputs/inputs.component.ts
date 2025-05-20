import { NgIf } from '@angular/common';
import { Component, Input, OnInit, forwardRef } from '@angular/core';
import { ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { heroEyeSolid, heroEyeSlashSolid, heroUserSolid, heroLockClosedSolid } from '@ng-icons/heroicons/solid';

@Component({
  selector: 'app-inputs',
  standalone: true,
  imports: [NgIf, ReactiveFormsModule, NgIcon],
  templateUrl: './inputs.component.html',
  styleUrl: './inputs.component.css',
  providers: [
    provideIcons({ heroEyeSolid, heroEyeSlashSolid, heroUserSolid, heroLockClosedSolid }),
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputsComponent),
      multi: true
    }
  ]
})
export class InputsComponent implements ControlValueAccessor, OnInit {
  private INITIALIZER_STRING = '';

  @Input() label: string = this.INITIALIZER_STRING;
  @Input() id: string = this.INITIALIZER_STRING;
  @Input() name: string = this.INITIALIZER_STRING;
  @Input() placeholder: string = this.INITIALIZER_STRING;
  @Input() type: string = this.INITIALIZER_STRING;
  @Input() iconLeft?: string;
  @Input() controlName: string = this.INITIALIZER_STRING;
  @Input() altLeft?: string;
  @Input() iconRight?: string;
  @Input() altRight?: string;
  @Input() showIconRight?: boolean;
  @Input() control: FormControl = new FormControl();

  showPassword = false;
  value: string = '';
  onChange = (value: string) => {};
  onTouched = () => {};

  ngOnInit(): void {
    if (this.type === 'password') {
      this.iconRight = 'eye.svg';
    }
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
    this.type = this.showPassword ? 'text' : 'password';
    this.iconRight = this.showPassword ? 'eye.svg' : 'eye-off.svg';
  }

  handleInput(event: Event) {
    const input = event.target as HTMLInputElement;
    this.onChange(input.value);
  }

  writeValue(value: string): void {
    this.value = value;
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {}
}
