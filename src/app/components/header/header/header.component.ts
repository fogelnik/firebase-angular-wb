import {Component, OnInit} from '@angular/core';
import {AuthService} from '../../../services/auth.service';
import {Auth, onAuthStateChanged, user} from '@angular/fire/auth';
import {NgIf} from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  templateUrl: './header.component.html',
  imports: [
    NgIf
  ],
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit{

  isAuthenticated: boolean = false;

  constructor(private auth: Auth) {}

  ngOnInit() {
    onAuthStateChanged(this.auth, (user) => {
      this.isAuthenticated = !!user;
    })
  }



}
