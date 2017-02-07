import { Component, OnInit } from '@angular/core';
import {Validators,FormControl,FormGroup,FormBuilder} from '@angular/forms';
import {Message} from "primeng/components/common/api";
import {AuthGuard} from "../auth/AuthGuard";
import {Router} from "@angular/router";

@Component({
  selector: 'login-view',
  templateUrl: './login-view.component.html',
  styleUrls: ['./login-view.component.css']
})
export class LoginViewComponent implements OnInit {
  submitted = false;
  model = {
    name: '',
    password: ''
  };
  msgs: Message[] = [];

  userform: FormGroup;

  constructor(private fb: FormBuilder, private router:Router, private authGuard:AuthGuard) {}

  onSubmit() {
    this.submitted = true;
    console.log("onSubmit: name="+this.model.name+", pwd="+this.model.password);
    this.authGuard.authenticated=true;
    this.router.navigate(['/']);
  }


  ngOnInit() {
    this.userform = this.fb.group({
      'loginname': new FormControl('', Validators.required),
      'password': new FormControl('', Validators.required),
    }); }

}
