import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-movie-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="min-h-screen bg-[#0a0f1e] p-8">
      <div class="max-w-7xl mx-auto">
        <!-- Header -->
        <div class="flex justify-between items-center mb-8">
          <div>
            <h1 class="text-4xl font-bold mb-2">Manage Movies</h1>
            <p class="text-gray-400">Create, edit, and manage all movies</p>
          </div>
          <div class="flex gap-4">
            <button (click)="showInactive = !showInactive; loadMovies()" 
                    [class]="showInactive ? 'px-6 py-3 bg-gray-600 hover:bg-gray-700 rounded-xl font-semibold transition-all' : 'px-6 py-3 bg-gray-700/50 hover:bg-gray-600 rounded-xl font-semibold transition-all'">
              {{ showInactive ? 'Show Active Only' : 'Show Inactive' }}
            </button>
            <button (click)="addMovie()" class="px-6 py-3 bg-red-600 hover:bg-red-700 rounded-xl font-semibold transition-all transform hover:-translate-y-0.5 shadow-lg shadow-red-900/20">
              + Add New Movie
            </button>
          </div>
        </div>

        <!-- Movies Table -->
        <div class="bg-[#141b2d] rounded-2xl border border-white/10 overflow-hidden">
          <div *ngIf="loading" class="p-12 text-center">
            <div class="inline-block animate-spin rounded-full h-12 w-12 border-4 border-red-600 border-t-transparent"></div>
            <p class="mt-4 text-gray-400">Loading movies...</p>
          </div>

          <div *ngIf="!loading && movies.length === 0" class="p-12 text-center">
            <svg class="w-20 h-20 mx-auto text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z"></path>
            </svg>
            <p class="text-xl text-gray-400 mb-2">No movies found</p>
            <p class="text-gray-500 mb-6">Add your first movie to get started</p>
            <button (click)="addMovie()" class="px-6 py-3 bg-red-600 hover:bg-red-700 rounded-xl font-semibold transition-all">
              + Add Movie
            </button>
          </div>

          <table *ngIf="!loading && movies.length > 0" class="w-full">
            <thead class="bg-[#1e293b] border-b border-white/10">
              <tr>
                <th class="px-6 py-4 text-left text-sm font-semibold text-gray-300">Poster</th>
                <th class="px-6 py-4 text-left text-sm font-semibold text-gray-300">Title</th>
                <th class="px-6 py-4 text-left text-sm font-semibold text-gray-300">Crew</th>
                <th class="px-6 py-4 text-left text-sm font-semibold text-gray-300">Genre</th>
                <th class="px-6 py-4 text-left text-sm font-semibold text-gray-300">Duration</th>
                <th class="px-6 py-4 text-left text-sm font-semibold text-gray-300">Rating</th>
                <th class="px-6 py-4 text-left text-sm font-semibold text-gray-300">Status</th>
                <th class="px-6 py-4 text-right text-sm font-semibold text-gray-300">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-white/5">
              <tr *ngFor="let movie of movies" class="hover:bg-white/5 transition-colors">
                <td class="px-6 py-4">
                  <img [src]="getImageUrl(movie.displayImageUrl)" [alt]="movie.title" 
                       class="w-16 h-24 object-cover rounded-lg border border-white/10"
                       onerror="this.src='https://via.placeholder.com/200x300?text=No+Image'">
                </td>
                <td class="px-6 py-4">
                  <p class="font-semibold text-white">{{ movie.title }}</p>
                  <p class="text-sm text-gray-400">{{ movie.releaseDate | date:'mediumDate' }}</p>
                </td>
                <td class="px-6 py-4 text-gray-300 text-sm">{{ movie.crew }}</td>
                <td class="px-6 py-4">
                  <span class="text-sm text-gray-400">{{ movie.genre }}</span>
                </td>
                <td class="px-6 py-4 text-gray-300">{{ movie.durationMinutes }} min</td>
                <td class="px-6 py-4">
                  <span class="px-3 py-1 bg-blue-600/20 text-blue-400 rounded-lg text-sm font-medium">
                    {{ movie.parentalRating }}
                  </span>
                </td>
                <td class="px-6 py-4">
                  <span [class]="movie.isActive ? 'px-3 py-1 bg-green-600/20 text-green-400 rounded-lg text-sm font-medium' : 'px-3 py-1 bg-red-600/20 text-red-400 rounded-lg text-sm font-medium'">
                    {{ movie.isActive ? 'Active' : 'Inactive' }}
                  </span>
                </td>
                <td class="px-6 py-4">
                  <div class="flex justify-end gap-2">
                    <button (click)="editMovie(movie.movieId)" 
                            class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-all">
                      Edit
                    </button>
                    <button *ngIf="!movie.isActive" (click)="activateMovie(movie.movieId)" 
                            class="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-all">
                      Activate
                    </button>
                    <button *ngIf="movie.isActive" (click)="deleteMovie(movie.movieId)" 
                            class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-all">
                      Deactivate
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `
})
export class MovieListComponent implements OnInit {
  movies: any[] = [];
  loading = true;
  showInactive = false;

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadMovies();
  }

  loadMovies() {
    this.loading = true;
    const activeOnly = !this.showInactive;
    this.http.get<any>(`${environment.apiUrl}/admin/movies?activeOnly=${activeOnly}`).subscribe({
      next: (response) => {
        this.movies = response.data || response;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.movies = [];
      }
    });
  }

  getImageUrl(path: string): string {
    if (!path) return 'https://via.placeholder.com/200x300?text=No+Image';
    if (path.startsWith('http')) return path;
    return `http://localhost:8081${path}`;  // path is already /display/filename
  }

  addMovie() {
    this.router.navigate(['/admin/movies/add']);
  }

  editMovie(id: number) {
    this.router.navigate(['/admin/movies/edit', id]);
  }

  deleteMovie(id: number) {
    if (confirm('Are you sure you want to deactivate this movie?')) {
      this.http.delete(`${environment.apiUrl}/admin/movies/${id}`).subscribe({
        next: () => {
          this.loadMovies();
        },
        error: (err) => {
          console.error('Error deactivating movie:', err);
          alert('Failed to deactivate movie. Please try again.');
        }
      });
    }
  }

  activateMovie(id: number) {
    if (confirm('Are you sure you want to activate this movie?')) {
      this.http.put(`${environment.apiUrl}/admin/movies/${id}/activate`, {}).subscribe({
        next: () => {
          this.loadMovies();
        },
        error: (err) => {
          console.error('Error activating movie:', err);
          alert('Failed to activate movie. Please try again.');
        }
      });
    }
  }
}
