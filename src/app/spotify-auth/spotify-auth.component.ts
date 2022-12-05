import { Component, OnInit } from '@angular/core';
import { SpotifyAuthService } from '../services/spotify-auth.service';

@Component({
  selector: 'app-spotify-auth',
  templateUrl: './spotify-auth.component.html',
  styleUrls: ['./spotify-auth.component.css']
})
export class SpotifyAuthComponent implements OnInit {
  constructor(private readonly authService: SpotifyAuthService) {}

  ngOnInit(): void {
    // Check for auth redirect callback route
  }

  signInToSpotify() {
    this.authService.authRedirect();
  }

  handleAuthCallback() {
    this.authService.authCallback();
  }
}
