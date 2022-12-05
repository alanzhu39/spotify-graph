import { Injectable } from '@angular/core';
import { generateRandomString } from '../utils/utils';
import { stringify } from 'querystring';

@Injectable({
  providedIn: 'root'
})
export class SpotifyAuthService {
  authRedirect() {
    const clientId = 'CLIENT_ID';
    const redirectUri = 'http://localhost:8888/callback';

    const state = generateRandomString(16);
    const scope = 'user-read-private user-read-email';

    window.location.href =
      'https://accounts.spotify.com/authorize?' +
      stringify({
        response_type: 'code',
        client_id: clientId,
        scope,
        redirect_uri: redirectUri,
        state
      });
  }

  authCallback() {
    // Handle auth callback
  }
}
