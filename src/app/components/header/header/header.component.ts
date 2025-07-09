import {Component, OnInit} from '@angular/core';
import {AuthService} from '../../../services/auth.service';
import {Auth, onAuthStateChanged, user} from '@angular/fire/auth';
import {NgIf} from '@angular/common';
import {Router, RouterLink} from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  templateUrl: './header.component.html',
  imports: [
    NgIf,
    RouterLink
  ],
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit{

  isAuthenticated: boolean = false;

  constructor(private auth: Auth, private router: Router) {}

  ngOnInit() {
    onAuthStateChanged(this.auth, (user) => {
      this.isAuthenticated = !!user;
    })
  }

  navigateUser(){
    if(this.isAuthenticated){
      this.router.navigate(['profile']);
    }else {
      this.router.navigate(['auth/sign-in']);
    }
  }



}
