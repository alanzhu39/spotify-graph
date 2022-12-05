import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { Network, DataSet } from 'vis';
import { SpotifyGraphService } from '../services/spotify-graph.service';

@Component({
  selector: 'app-spotify-graph',
  templateUrl: './spotify-graph.component.html',
  styleUrls: ['./spotify-graph.component.css']
})
export class SpotifyGraphComponent implements AfterViewInit {
  @ViewChild('network') el: ElementRef;
  private networkInstance: any;

  constructor(private readonly graphService: SpotifyGraphService) {}

  drawGraph() {
    const container = this.el.nativeElement;
    const data = {
      nodes: this.graphService.getNodes(),
      edges: this.graphService.getEdges()
    };
    const options = {
      nodes: {
        shape: 'dot',
        size: 16
      },
      physics: {
        forceAtlas2Based: {
          gravitationalConstant: -26,
          centralGravity: 0.005,
          springLength: 230,
          springConstant: 0.18
        },
        maxVelocity: 146,
        solver: 'forceAtlas2Based',
        timestep: 0.35,
        stabilization: { iterations: 150 }
      }
    };
    this.networkInstance = new Network(container, data, {});
  }

  ngAfterViewInit() {
    // this.graphService.populateGraph();
    this.drawGraph();
  }
}
