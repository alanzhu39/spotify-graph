<!-- Improved compatibility of back to top link: See: https://github.com/othneildrew/Best-README-Template/pull/73 -->

<a name="readme-top"></a>

<!--
*** Thanks for checking out the Best-README-Template. If you have a suggestion
*** that would make this better, please fork the repo and create a pull request
*** or simply open an issue with the tag "enhancement".
*** Don't forget to give the project a star!
*** Thanks again! Now go create something AMAZING! :D
-->

<!-- PROJECT SHIELDS -->
<!--
*** I'm using markdown "reference style" links for readability.
*** Reference links are enclosed in brackets [ ] instead of parentheses ( ).
*** See the bottom of this document for the declaration of the reference variables
*** for contributors-url, forks-url, etc. This is an optional, concise syntax you may use.
*** https://www.markdownguide.org/basic-syntax/#reference-style-links
-->

[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![MIT License][license-shield]][license-url]
[![LinkedIn][linkedin-shield]][linkedin-url]

<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://github.com/alanzhu39/spotify-graph">
    <img src="images/logo.svg" alt="Logo" width="80" height="80">
  </a>

  <h3 align="center">Spoti-graph</h3>
</div>

<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#roadmap">Roadmap</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
    <li><a href="#acknowledgments">Acknowledgments</a></li>
  </ol>
</details>

<!-- ABOUT THE PROJECT -->

## About The Project

[![Spoti-graph Screen Shot][product-screenshot]](https://spoti-graph-d4441.web.app/)

Spoti-graph is a tool that generates a graph of the artists in your Spotify library.
Nodes in the graph are the artists from your saved songs.
If two artists are related (as determined by Spotify's listening statistics), they'll have an edge between them.
Once the graph is drawn, you'll likely see artists from similar genres or communities clustered together.

Try it out and see what your listening graph is like!

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### Built With

- [![Angular][angular.io]][angular-url]
- [![vis.js][visjs]][visjs-url]

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- GETTING STARTED -->

## Getting Started

To get a local copy up and running follow these simple example steps.

### Prerequisites

- npm

  ```sh
  npm install npm@latest -g
  ```

- Angular CLI
  ```sh
  npm install @angular/cli -g
  ```

### Running the app

1. Clone the repo
   ```sh
   git clone https://github.com/alanzhu39/spotify-graph.git
   ```
2. Install NPM packages
   ```sh
   npm install
   ```
3. Start local app instance
   ```sh
   ng serve
   ```

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- ROADMAP -->

## Roadmap

- [ ] Graphs based on playlists
- [ ] Node/edge weighting based on frequency of artist
- [ ] Better graph grouping/clustering visualization
- [ ] More graph customization options

See the [open issues](https://github.com/alanzhu39/spotify-graph/issues) for a full list of proposed features (and known issues).

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- CONTRIBUTING -->

## Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".
Don't forget to give the project a star! Thanks again!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- LICENSE -->

## License

Distributed under the MIT License. See `LICENSE` for more information.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- CONTACT -->

## Contact

Alan Zhu - [@alanzhu39](https://twitter.com/alanzhu39) - alan.zhu39@gmail.com

Project Link: [https://github.com/alanzhu39/spotify-graph](https://github.com/alanzhu39/spotify-graph)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- ACKNOWLEDGMENTS -->

## Acknowledgments

- [Spotify APIs](https://developer.spotify.com/)
- [Best README Template](https://github.com/othneildrew/Best-README-Template)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->

[contributors-shield]: https://img.shields.io/github/contributors/alanzhu39/spotify-graph.svg?style=for-the-badge
[contributors-url]: https://github.com/alanzhu39/spotify-graph/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/alanzhu39/spotify-graph.svg?style=for-the-badge
[forks-url]: https://github.com/alanzhu39/spotify-graph/network/members
[stars-shield]: https://img.shields.io/github/stars/alanzhu39/spotify-graph.svg?style=for-the-badge
[stars-url]: https://github.com/alanzhu39/spotify-graph/stargazers
[issues-shield]: https://img.shields.io/github/issues/alanzhu39/spotify-graph.svg?style=for-the-badge
[issues-url]: https://github.com/alanzhu39/spotify-graph/issues
[license-shield]: https://img.shields.io/github/license/alanzhu39/spotify-graph.svg?style=for-the-badge
[license-url]: https://github.com/alanzhu39/spotify-graph/blob/master/LICENSE
[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=for-the-badge&logo=linkedin&colorB=555
[linkedin-url]: https://linkedin.com/in/alan-z-55b308138
[product-screenshot]: images/screenshot.png
[next.js]: https://img.shields.io/badge/next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white
[angular.io]: https://img.shields.io/badge/Angular-DD0031?style=for-the-badge&logo=angular&logoColor=white
[angular-url]: https://angular.io/
[visjs]: https://img.shields.io/badge/vis.js-%23000000.svg?style=for-the-badge
[visjs-url]: https://visjs.org/
