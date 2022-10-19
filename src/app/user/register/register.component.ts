import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import IUser from 'src/app/models/user.model';
import { AuthService } from 'src/app/services/auth.service';
import { EmailTaken } from '../validators/email-taken';
import { RegisterValidators } from '../validators/register-validators';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  registerForm = new FormGroup({
    name: this.fb.control('', [Validators.required]),
    email: this.fb.control('', [Validators.required], [this.emailTaken.validate]),
    age: this.fb.control<number | null>(null, [Validators.required]),
    password: this.fb.control('', [Validators.required]),
    confirm_password: this.fb.control('', [Validators.required]),
    phone: this.fb.control('', [Validators.required])
  }, [RegisterValidators.match('password', 'confirm_password')])

  inSubmission: boolean = false
  isAlert: boolean = false
  alertMsg: string = 'Alert Message!'
  alertColor: string = 'blue'


  constructor(private fb: FormBuilder,
              private auth: AuthService,
              private emailTaken: EmailTaken
            ) {}

  ngOnInit(): void {
  }

  getFormControl(controlName: string): FormControl {
    return this.registerForm.get(controlName) as FormControl
  }

  async register() {
    this.inSubmission = true
    this.alertColor = 'green'
    this.alertMsg = 'User created successfully!'
    try {
      this.auth.addUser(this.registerForm.value as IUser)
    } catch (error) {
      console.error(error)
      this.alertColor = 'red'
      this.alertMsg = 'Unexpected error!'

      return
    }

    this.isAlert = true
    this.inSubmission = false
  }

}
