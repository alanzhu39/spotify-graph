import { HttpErrorResponse } from '@angular/common/http';
import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  ViewChild
} from '@angular/core';
import { Network, DataSet, Node, Edge } from 'vis';
import {
  SpotifyApiService,
  SpotifyArtist,
  SpotifyPlaylist,
  SpotifySavedTrack
} from '../services/spotify-api.service';
import { delay, getDefaultData } from '../utils/utils';

@Component({
  selector: 'app-spotify-graph',
  templateUrl: './spotify-graph.component.html',
  styleUrls: ['./spotify-graph.component.css']
})
export class SpotifyGraphComponent implements AfterViewInit {
  @ViewChild('network') el: ElementRef;
  private networkInstance: Network;

  private readonly MAX_NODES = 1000;
  readonly REQS_PER_SEC = 50;
  readonly math = Math;

  // added seconds per 100 nodes to stabilize graph
  readonly GRAPH_LATENCY = 3;

  private readonly nodes: DataSet<Node> = new DataSet([], {
    queue: true
  });

  private readonly edges: DataSet<Edge> = new DataSet([], {
    queue: true
  });

  readonly artists: Set<string> = new Set();
  private readonly connections: Set<string> = new Set();
  playlists: SpotifyPlaylist[] = [];

  isLoggedIn: boolean = false;
  showDialog: boolean = true;
  playlistsLoading: boolean = true;
  graphLoading: boolean = false;
  error: boolean = false;
  timeRemaining: number = 0;

  constructor(private readonly apiService: SpotifyApiService) {
    this.isLoggedIn = apiService.isLoggedIn();
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.networkInstance.redraw();
  }

  ngAfterViewInit() {
    this.getPlaylists();
    if (this.artists.size === 0) this.drawGraph(true);
  }

  logoutOfSpotify() {
    this.apiService.authLogout();
  }

  buildGraph() {
    this.clearGraph();
    this.populateGraph();
    this.drawGraph();
  }

  populateGraph() {
    this.graphLoading = true;
    this.getArtists();
  }

  drawGraph(isDefault: boolean = false) {
    const data = isDefault
      ? getDefaultData()
      : {
          nodes: this.nodes,
          edges: this.edges
        };
    const options = {
      autoResize: false,
      nodes: {
        borderWidth: 4,
        shape: 'dot',
        size: 30,
        color: {
          border: '#222222',
          background: '#666666',
          highlight: 'lightgray'
        },
        font: { color: '#eeeeee' }
      },
      edges: {
        color: {
          color: 'gray',
          highlight: 'lightgray'
        },
        width: 2
      },
      physics: {
        solver: 'forceAtlas2Based',
        forceAtlas2Based: {
          gravitationalConstant: -26,
          centralGravity: 0.003,
          springLength: 100,
          springConstant: 0.18
        },
        stabilization: { iterations: 150 }
      }
    };
    this.networkInstance = new Network(this.el.nativeElement, data, options);
  }

  clearGraph() {
    this.nodes.clear();
    this.edges.clear();
    this.artists.clear();
    this.edges.clear();
  }

  getPlaylists(offset: number = 0) {
    const limit = 50;
    // Get user playlists
    this.apiService.getPlaylists(limit, offset).subscribe({
      next: (data: { items: SpotifyPlaylist[]; next: string | null }) => {
        this.playlists = this.playlists.concat(data.items);

        if (data.next != null) {
          this.getPlaylists(offset + limit);
        } else {
          this.playlistsLoading = false;
        }
      },
      error: (error) => {
        this.apiService.handleApiError(error);
        this.playlistsLoading = false;
      }
    });
  }

  getArtists(offset: number = 0) {
    const limit = 50;
    // Get saved tracks
    this.apiService.getSavedTracks(limit, offset).subscribe({
      next: (data: { items: SpotifySavedTrack[] }) => {
        // Get artists from saved tracks
        const artistIds: string[] = [];
        data.items.forEach((savedTrack: SpotifySavedTrack) => {
          savedTrack.track.artists.forEach((artist: SpotifyArtist) => {
            if (!this.artists.has(artist.id)) {
              this.artists.add(artist.id);
              artistIds.push(artist.id);
            }
          });
        });

        // Get artist images
        for (let i = 0; i < artistIds.length; i += 50) {
          this.apiService
            .getArtists(artistIds.slice(i, i + 50))
            .subscribe((data: { artists: SpotifyArtist[] }) => {
              data.artists.forEach((artist: SpotifyArtist) => {
                const artistImage =
                  artist.images !== undefined && artist.images.length >= 3
                    ? artist.images[2]
                    : undefined;
                if (artistImage !== undefined) {
                  this.nodes.update({
                    id: artist.id,
                    label: artist.name,
                    shape: 'circularImage',
                    image: artistImage?.url
                  });
                  this.timeRemaining +=
                    1 / this.REQS_PER_SEC + this.GRAPH_LATENCY / 100;
                } else {
                  this.artists.delete(artistIds[i]);
                }
              });
            });
        }

        if (data.items.length === limit && offset + limit < this.MAX_NODES) {
          // Use timeout to prevent rate-limiting
          setTimeout(() => this.getArtists(offset + limit), 100);
        } else {
          void this.getConnections();
        }
      },
      error: (error) => {
        this.apiService.handleApiError(error);
        this.clearGraph();
        this.error = true;
        this.graphLoading = false;
      }
    });
  }

  async getConnections() {
    // Get related artists
    let counter = 1;
    for (const artistId of this.artists) {
      if (counter++ % this.REQS_PER_SEC === 0) {
        this.timeRemaining -= 1;
        await delay(1000);
      }
      this.apiService.getRelatedArtists(artistId).subscribe({
        next: (data: { artists: SpotifyArtist[] }) => {
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
        },
        error: (error: HttpErrorResponse) => {
          this.apiService.handleApiError(error);
          this.clearGraph();
          this.error = true;
          this.graphLoading = false;
        }
      });
    }
    this.nodes.flush();
    this.edges.flush();
    const interval = setInterval(() => (this.timeRemaining -= 1), 1000);
    this.networkInstance.stabilize(200);
    this.networkInstance.once('stabilizationIterationsDone', () => {
      this.graphLoading = false;
      this.showDialog = false;
      clearInterval(interval);
      this.timeRemaining = 0;
    });
  }
}
