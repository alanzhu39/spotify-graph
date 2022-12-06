import { Component } from '@angular/core';
import { SpotifyApiService } from './services/spotify-api.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'spotify-graph';

  isLoggedIn: boolean = false;

  constructor(private readonly apiService: SpotifyApiService) {
    this.isLoggedIn = apiService.isLoggedIn();
  }
}
