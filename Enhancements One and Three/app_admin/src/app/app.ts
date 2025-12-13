import { Component, OnInit } from '@angular/core';
import { AuthService } from './services/authentication';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './navbar/navbar';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, NavbarComponent],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})

export class App implements OnInit {
  constructor(private authService: AuthService) {}

  ngOnInit() {
    // Grab token from URL
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    if (token) {
      this.authService.saveToken(token); // store it in localStorage
      window.history.replaceState({}, '', '/'); // remove token from URL
    }
  }
}
