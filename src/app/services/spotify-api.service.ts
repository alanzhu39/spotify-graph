import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SpotifyApiService {
  private authToken: string;

  constructor(private readonly http: HttpClient) {}

  setAuthToken(authToken: string) {
    this.authToken = authToken;
  }

  authHeader() {
    return {
      Authorization: `Bearer ${this.authToken}`
    };
  }

  getSavedTracks() {
    // Wrap spotify saved tracks endpoint
    // Include option for pagination
  }

  getRelatedArtists(artistId: string) {
    // Wrap spotify related artists endpoint
    this.http.get<{ artists: SpotifyArtist[] }>(
      `https://api.spotify.com/v1/artists/${artistId}/related-artists`,
      {
        headers: this.authHeader()
      }
    );
  }
}

export interface SpotifyArtistImage {
  height: number;
  width: number;
  url: string;
}

export interface SpotifyArtist {
  id: string;
  name: string;
  images: SpotifyArtistImage[];
}
