import { Component, OnInit } from '@angular/core';
import { SpotifyApiService } from '../services/spotify-api.service';

@Component({
  selector: 'app-spotify-auth',
  templateUrl: './spotify-auth.component.html',
  styleUrls: ['./spotify-auth.component.css']
})
export class SpotifyAuthComponent implements OnInit {
  constructor(private readonly apiService: SpotifyApiService) {}

  ngOnInit() {
    // Check for callback route
    if (window.location.pathname === '/callback') {
      this.handleAuthCallback();
    }
  }

  signInToSpotify() {
    this.apiService.authRedirect();
  }

  handleAuthCallback() {
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');
    const state = params.get('state');
    if (code == null || state == null) {
      // TODO: update error handling
      console.error('auth callback failed');
    } else {
      this.apiService.authCallback(code, state);
    }
  }
}
