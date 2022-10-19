import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { ModalService } from 'src/app/services/modal.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm = this.fb.group({
    email: ['', [Validators.required]],
    password: ['', [Validators.required]]
  })

  inSubmission: boolean = false
  isAlert: boolean = false
  alertMsg: string = 'Alert Message!'
  alertColor: string = 'blue'

  constructor(private fb: FormBuilder,
              private auth: AuthService) { }

  ngOnInit(): void {
  }

  async login() {
    const { email, password } = this.loginForm.value
    this.inSubmission = true
    this.alertColor = 'green'
    this.alertMsg = 'User logged in successfully!'
    try {
      await this.auth.loginUser(email as string, password as string)
    } catch (error) {
      this.alertColor = 'red'
      this.alertMsg = 'Unexpected error!'
      this.isAlert = true
      this.inSubmission = false

      return
    }

    this.isAlert = true
    this.inSubmission = false
    
  }

}
