import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-movie-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="min-h-screen bg-[#050505] pt-24">
      <div class="container mx-auto px-4 py-8">
        <h1 class="text-4xl font-bold mb-8 text-white">All Movies</h1>
        
        <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          <a *ngFor="let movie of movies" [routerLink]="['/movies', movie.movieId]" 
             class="group relative bg-[#121212] rounded-2xl overflow-hidden border border-white/5 hover:border-red-500/50 transition-all duration-500 hover:-translate-y-3 hover:shadow-2xl cursor-pointer block">
            <!-- Full Card Image -->
            <div class="relative aspect-[2/3] overflow-hidden">
              <img 
                [src]="getImageUrl(movie.displayImageUrl)" 
                [alt]="movie.title"
                class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div class="absolute inset-0 bg-gradient-to-t from-[#121212] via-transparent to-transparent opacity-60 group-hover:opacity-90 transition-opacity"></div>
            </div>
            
            <!-- Content Overlay -->
            <div class="absolute bottom-0 left-0 w-full p-6">
              <h3 class="text-2xl font-bold mb-2 text-white group-hover:text-red-500 transition-colors">{{ movie.title }}</h3>
              <p class="text-gray-400 text-sm mb-2">{{ movie.genre }}</p>
              <div class="flex gap-3 items-center text-xs text-gray-500">
                <span>{{ movie.language }}</span>
                <span class="w-1 h-1 rounded-full bg-gray-600"></span>
                <span>{{ movie.durationMinutes }} min</span>
              </div>
            </div>
          </a>
        </div>

        <div *ngIf="movies.length === 0" class="text-center py-16 text-gray-400">
          No movies available at the moment
        </div>
      </div>
    </div>
  `
})
export class MovieListComponent implements OnInit {
  movies: any[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.http.get<any>(`${environment.apiUrl}/movies`).subscribe({
      next: (response) => {
        this.movies = response.data;
      },
      error: (err) => {
        console.error('Error loading movies:', err);
        this.movies = [];
      }
    });
  }

  getImageUrl(path: string): string {
    if (!path) return 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=1000';
    if (path.startsWith('http')) return path;
    return `http://localhost:8081${path}`;
  }
}
