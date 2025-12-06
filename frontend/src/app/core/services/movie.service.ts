import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Movie {
  movieId: number;
  title: string;
  description: string;
  genre: string;
  language: string;
  durationMinutes: number;
  releaseDate: string;
  rating: number;
  displayImageUrl: string;
  bannerImageUrl: string;
  trailerUrl?: string;
  active: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

@Injectable({
  providedIn: 'root'
})
export class MovieService {
  private readonly API_URL = `${environment.apiUrl}/movies`;
  
  movies = signal<Movie[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);

  constructor(private http: HttpClient) {}

  getAllMovies(): Observable<ApiResponse<Movie[]>> {
    this.loading.set(true);
    this.error.set(null);
    
    return this.http.get<ApiResponse<Movie[]>>(this.API_URL).pipe(
      tap({
        next: (response) => {
          this.movies.set(response.data);
          this.loading.set(false);
        },
        error: (err) => {
          this.error.set(err.message);
          this.loading.set(false);
          console.error('Error loading movies:', err);
        }
      })
    );
  }

  getNowShowingMovies(): Observable<ApiResponse<Movie[]>> {
    this.loading.set(true);
    this.error.set(null);
    
    return this.http.get<ApiResponse<Movie[]>>(`${this.API_URL}/now-showing`).pipe(
      tap({
        next: (response) => {
          this.movies.set(response.data);
          this.loading.set(false);
        },
        error: (err) => {
          this.error.set(err.message);
          this.loading.set(false);
          console.error('Error loading now showing movies:', err);
        }
      })
    );
  }

  getComingSoonMovies(): Observable<ApiResponse<Movie[]>> {
    return this.http.get<ApiResponse<Movie[]>>(`${this.API_URL}/coming-soon`);
  }

  getMovieById(id: number): Observable<ApiResponse<Movie>> {
    return this.http.get<ApiResponse<Movie>>(`${this.API_URL}/${id}`);
  }

  searchMovies(title: string): Observable<ApiResponse<Movie[]>> {
    return this.http.get<ApiResponse<Movie[]>>(`${this.API_URL}/search`, {
      params: { title }
    });
  }

  getMoviesByGenre(genre: string): Observable<ApiResponse<Movie[]>> {
    return this.http.get<ApiResponse<Movie[]>>(`${this.API_URL}/genre/${genre}`);
  }

  getMoviesByLanguage(language: string): Observable<ApiResponse<Movie[]>> {
    return this.http.get<ApiResponse<Movie[]>>(`${this.API_URL}/language/${language}`);
  }

  getImageUrl(path: string): string {
    if (!path) return 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=1000';
    if (path.startsWith('http')) return path;
    return `http://localhost:8081${path}`;
  }
}
