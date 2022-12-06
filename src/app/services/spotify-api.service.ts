import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { stringify } from 'querystring';
import { generateCodeChallenge, generateRandomString } from '../utils/utils';

@Injectable({
  providedIn: 'root'
})
export class SpotifyApiService {
  private readonly siteUrl = 'http://localhost:4200';
  private readonly clientId = '85b816ac845f4c718040ef7bddc92a64';
  private readonly redirectUri = `${this.siteUrl}/callback`;
  private state: string;
  private codeVerifier: string;
  private authToken: SpotifyAuthToken;

  constructor(private readonly http: HttpClient) {
    const state = window.localStorage.getItem('AUTH_STATE');
    if (state != null) this.state = state;
    const codeVerifier = window.localStorage.getItem('AUTH_CODE_VERIFIER');
    if (codeVerifier != null) this.codeVerifier = codeVerifier;
    const authToken = window.localStorage.getItem('AUTH_TOKEN');
    if (authToken != null) this.authToken = { ...JSON.parse(authToken) };
  }

  authRedirect() {
    this.state = generateRandomString(16);
    this.codeVerifier = generateRandomString(64);

    window.localStorage.setItem('AUTH_STATE', this.state);
    window.localStorage.setItem('AUTH_CODE_VERIFIER', this.codeVerifier);

    const scope = 'user-library-read';

    window.location.href =
      'https://accounts.spotify.com/authorize?' +
      stringify({
        response_type: 'code',
        client_id: this.clientId,
        scope,
        redirect_uri: this.redirectUri,
        state: this.state,
        code_challenge_method: 'S256',
        code_challenge: generateCodeChallenge(this.codeVerifier)
      });
  }

  authCallback(code: string, state: string) {
    // Handle auth callback
    if (state !== this.state) {
      // TODO
      console.error('state mismatch!');
      window.location.replace(this.siteUrl);
    } else {
      const body = new URLSearchParams({
        code,
        redirect_uri: this.redirectUri,
        grant_type: 'authorization_code',
        client_id: this.clientId,
        code_verifier: this.codeVerifier
      });
      this.http
        .post<SpotifyAuthToken>(
          'https://accounts.spotify.com/api/token',
          body,
          {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
            }
          }
        )
        .subscribe((authToken) => {
          this.setAuthToken(authToken);
          window.location.replace(this.siteUrl);
        });
    }
  }

  setAuthToken(authToken: SpotifyAuthToken) {
    this.authToken = authToken;
    window.localStorage.setItem('AUTH_TOKEN', JSON.stringify(this.authToken));
  }

  authHeader() {
    return {
      Authorization: `Bearer ${this.authToken.access_token}`
    };
  }

  getSavedTracks(limit: number = 20, offset: number = 0) {
    // Wrap spotify saved tracks endpoint
    return this.http.get<{ items: SpotifySavedTrack[] }>(
      `https://api.spotify.com/v1/me/tracks?limit=${limit}&offset=${offset}`,
      {
        headers: this.authHeader()
      }
    );
  }

  getArtists(artistIds: string[]) {
    // Wrap spotify related artists endpoint
    return this.http.get<{ artists: SpotifyArtist[] }>(
      `https://api.spotify.com/v1/artists?ids=${artistIds.join(',')}`,
      {
        headers: this.authHeader()
      }
    );
  }

  getRelatedArtists(artistId: string) {
    // Wrap spotify related artists endpoint
    return this.http.get<{ artists: SpotifyArtist[] }>(
      `https://api.spotify.com/v1/artists/${artistId}/related-artists`,
      {
        headers: this.authHeader()
      }
    );
  }

  refreshAuthToken() {
    // TODO
  }
}

interface SpotifyAuthToken {
  access_token: string;
  token_type: string;
  scope: string;
  expires_in: number;
  refresh_token: string;
}

export interface SpotifyArtistImage {
  height: number;
  width: number;
  url: string;
}

export interface SpotifyArtist {
  id: string;
  name: string;
  images?: SpotifyArtistImage[];
}

export interface SpotifySavedTrack {
  track: SpotifyTrack;
}

export interface SpotifyTrack {
  artists: SpotifyArtist[];
}
