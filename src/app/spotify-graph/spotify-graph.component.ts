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
  private networkInstance: any;

  private readonly MAX_NODES: number = 500;

  private readonly nodes: DataSet<Node> = new DataSet();
  private readonly edges: DataSet<Edge> = new DataSet();
  readonly artists: Set<string> = new Set();
  private readonly connections: Set<string> = new Set();
  isLoggedIn: boolean = false;
  showDialog: boolean = true;
  isLoading: boolean = false;
  error: boolean = false;
  counter: number = 1;

  constructor(private readonly apiService: SpotifyApiService) {
    this.isLoggedIn = apiService.isLoggedIn();
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.networkInstance.redraw();
  }

  ngAfterViewInit() {
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
    this.isLoading = true;
    this.getArtists();
  }

  drawGraph(isDefault: boolean = false) {
    const container = this.el.nativeElement;
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
          color: 'lightgray'
        },
        width: 2
        // },
        // physics: {
        //   forceAtlas2Based: {
        //     gravitationalConstant: -26,
        //     centralGravity: 0.005,
        //     springLength: 230,
        //     springConstant: 0.18
        //   },
        //   maxVelocity: 146,
        //   solver: 'forceAtlas2Based',
        //   timestep: 0.35,
        //   stabilization: { iterations: 150 }
      }
    };
    this.networkInstance = new Network(container, data, options);
  }

  clearGraph() {
    this.nodes.clear();
    this.edges.clear();
    this.artists.clear();
    this.edges.clear();
  }

  getArtists(offset: number = 0) {
    const limit = 50;
    // Get saved tracks
    this.apiService.getSavedTracks(limit, offset).subscribe(
      (data: { items: SpotifySavedTrack[] }) => {
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
                  this.nodes.add({
                    id: artist.id,
                    label: artist.name,
                    shape: 'circularImage',
                    image: artistImage?.url
                  });
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
      (error) => {
        this.apiService.handleApiError(error);
        this.clearGraph();
        this.error = true;
        this.isLoading = false;
      }
    );
  }

  async getConnections() {
    // Get related artists
    this.counter = 1;
    for (const artistId of this.artists) {
      if (this.counter++ % 10 === 0) await delay(1000); // wait 5 seconds every 50 requests to prevent rate limiting
      this.apiService
        .getRelatedArtists(artistId)
        .subscribe((data: { artists: SpotifyArtist[] }) => {
          data.artists.forEach(
            (artist: SpotifyArtist) => {
              const edgeStr =
                artistId < artist.id
                  ? `${artistId}:${artist.id}`
                  : `${artist.id}:${artistId}`;
              if (
                this.artists.has(artist.id) &&
                !this.connections.has(edgeStr)
              ) {
                this.connections.add(edgeStr);
                this.edges.add({ from: artistId, to: artist.id });
              }
            },
            (error: HttpErrorResponse) => {
              this.apiService.handleApiError(error);
              this.clearGraph();
              this.error = true;
              this.isLoading = false;
            }
          );
        });
    }
    this.isLoading = false;
    this.showDialog = false;
  }
}
