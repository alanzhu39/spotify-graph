import { Injectable } from '@angular/core';
import { DataSet, Node, Edge } from 'vis';
import {
  SpotifyApiService,
  SpotifyArtist,
  SpotifySavedTrack
} from './spotify-api.service';

@Injectable({
  providedIn: 'root'
})
export class SpotifyGraphService {
  private readonly nodes: DataSet<Node> = new DataSet();
  private readonly edges: DataSet<Edge> = new DataSet();
  private readonly artists: Set<string> = new Set();
  private readonly connections: Set<string> = new Set();

  constructor(private readonly apiService: SpotifyApiService) {}

  getArtists(offset: number = 0) {
    const limit = 50;
    // Get saved tracks
    this.apiService
      .getSavedTracks(limit, offset)
      .subscribe((data: { items: SpotifySavedTrack[] }) => {
        data.items.forEach((savedTrack: SpotifySavedTrack) => {
          savedTrack.track.artists.forEach((artist: SpotifyArtist) => {
            if (!this.artists.has(artist.id)) {
              this.artists.add(artist.id);
              this.nodes.add({ id: artist.id, label: artist.name });
            }
          });
        });
        if (data.items.length === 50 && offset < 500) {
          this.getArtists(offset + 50);
        } else {
          this.getConnections();
        }
      });
  }

  getConnections() {
    // Get related artists
    for (const artistId of this.artists) {
      this.apiService
        .getRelatedArtists(artistId)
        .subscribe((data: { artists: SpotifyArtist[] }) => {
          data.artists.forEach((artist: SpotifyArtist) => {
            const edgeStr =
              artistId < artist.id
                ? `${artistId}:${artist.id}`
                : `${artist.id}:${artistId}`;
            if (this.artists.has(artist.id) && !this.connections.has(edgeStr)) {
              this.connections.add(edgeStr);
              this.edges.add({ from: artistId, to: artist.id });
            }
          });
        });
    }
  }

  populateGraph() {
    this.getArtists();
  }

  getNodes() {
    return this.nodes;
  }

  getEdges() {
    return this.edges;
  }
}
