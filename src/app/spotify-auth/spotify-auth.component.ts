import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { SpotifyApiService } from '../services/spotify-api.service';

@Component({
  selector: 'app-spotify-auth',
  templateUrl: './spotify-auth.component.html',
  styleUrls: ['./spotify-auth.component.css']
})
export class SpotifyAuthComponent implements OnInit {
  private readonly siteUrl = environment.siteUrl;
  isLoading: boolean = false;

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
    this.isLoading = true;
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');
    const state = params.get('state');
    if (code == null || state == null) {
      // TODO: update error handling
      console.error('auth callback failed');
      this.isLoading = false;
      window.location.replace(this.siteUrl);
    } else {
      this.apiService.authCallback(code, state);
    }
  }
}
