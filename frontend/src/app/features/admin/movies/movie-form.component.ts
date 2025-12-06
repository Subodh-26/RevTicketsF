import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-movie-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="min-h-screen bg-[#0a0f1e] p-8">
      <div class="max-w-4xl mx-auto">
        <!-- Header -->
        <div class="mb-8">
          <button (click)="goBack()" class="flex items-center gap-2 text-gray-400 hover:text-white mb-4 transition-colors">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
            </svg>
            Back to Movies
          </button>
          <h1 class="text-4xl font-bold mb-2">{{ isEditMode ? 'Edit Movie' : 'Add New Movie' }}</h1>
          <p class="text-gray-400">{{ isEditMode ? 'Update movie details' : 'Fill in the details to add a new movie' }}</p>
        </div>

        <!-- Form -->
        <form [formGroup]="movieForm" (ngSubmit)="onSubmit()" class="bg-[#141b2d] rounded-2xl border border-white/10 p-8 space-y-6">
          <!-- Error Message -->
          <div *ngIf="error" class="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-xl">
            {{ error }}
          </div>

          <!-- Success Message -->
          <div *ngIf="successMessage" class="bg-green-500/10 border border-green-500/50 text-green-400 px-4 py-3 rounded-xl">
            {{ successMessage }}
          </div>

          <!-- Title -->
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2">Movie Title *</label>
            <input type="text" formControlName="title" 
                   class="w-full px-4 py-3 bg-[#0a0f1e] border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-red-500 transition-all"
                   placeholder="Enter movie title">
            <div *ngIf="movieForm.get('title')?.invalid && movieForm.get('title')?.touched" 
                 class="text-red-400 text-sm mt-1">Title is required</div>
          </div>

          <!-- Description -->
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2">Description *</label>
            <textarea formControlName="description" rows="4"
                      class="w-full px-4 py-3 bg-[#0a0f1e] border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-red-500 transition-all"
                      placeholder="Enter movie description"></textarea>
            <div *ngIf="movieForm.get('description')?.invalid && movieForm.get('description')?.touched" 
                 class="text-red-400 text-sm mt-1">Description is required</div>
          </div>

          <div class="grid grid-cols-2 gap-6">
            <!-- Crew -->
            <div>
              <label class="block text-sm font-medium text-gray-300 mb-2">Crew (Director, Writer, etc.) *</label>
              <input type="text" formControlName="crew"
                     class="w-full px-4 py-3 bg-[#0a0f1e] border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-red-500 transition-all"
                     placeholder="e.g., SS Rajamouli, V. Vijayendra Prasad">
              <p class="text-xs text-gray-500 mt-1">Comma-separated names</p>
            </div>

            <!-- Genre -->
            <div>
              <label class="block text-sm font-medium text-gray-300 mb-2">Genre *</label>
              <input type="text" formControlName="genre"
                     class="w-full px-4 py-3 bg-[#0a0f1e] border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-red-500 transition-all"
                     placeholder="e.g., Action, Drama, Comedy">
            </div>
          </div>

          <div class="grid grid-cols-3 gap-6">
            <!-- Duration -->
            <div>
              <label class="block text-sm font-medium text-gray-300 mb-2">Duration (min) *</label>
              <input type="number" formControlName="durationMinutes"
                     class="w-full px-4 py-3 bg-[#0a0f1e] border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-red-500 transition-all"
                     placeholder="120">
            </div>

            <!-- Rating -->
            <div>
              <label class="block text-sm font-medium text-gray-300 mb-2">Parental Rating *</label>
              <select formControlName="parentalRating"
                      class="w-full px-4 py-3 bg-[#0a0f1e] border border-white/10 rounded-xl text-white focus:outline-none focus:border-red-500 transition-all">
                <option value="">Select rating</option>
                <option value="U">U</option>
                <option value="UA">UA</option>
                <option value="A">A</option>
                <option value="R">R</option>
                <option value="PG-13">PG-13</option>
              </select>
            </div>

            <!-- Language -->
            <div>
              <label class="block text-sm font-medium text-gray-300 mb-2">Language *</label>
              <input type="text" formControlName="language"
                     class="w-full px-4 py-3 bg-[#0a0f1e] border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-red-500 transition-all"
                     placeholder="e.g., English">
            </div>
          </div>

          <div class="grid grid-cols-2 gap-6">
            <!-- Release Date -->
            <div>
              <label class="block text-sm font-medium text-gray-300 mb-2">Release Date *</label>
              <input type="date" formControlName="releaseDate"
                     class="w-full px-4 py-3 bg-[#0a0f1e] border border-white/10 rounded-xl text-white focus:outline-none focus:border-red-500 transition-all">
            </div>

            <!-- Cast -->
            <div>
              <label class="block text-sm font-medium text-gray-300 mb-2">Cast</label>
              <input type="text" formControlName="cast"
                     class="w-full px-4 py-3 bg-[#0a0f1e] border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-red-500 transition-all"
                     placeholder="Comma-separated names">
            </div>
          </div>

          <div class="grid grid-cols-2 gap-6">
            <!-- Display Image (Poster) Upload -->
            <div>
              <label class="block text-sm font-medium text-gray-300 mb-2">Display Image (Poster) *</label>
              <div class="space-y-2">
                <input type="file" (change)="onPosterFileChange($event)" accept="image/*"
                       class="w-full px-4 py-3 bg-[#0a0f1e] border border-white/10 rounded-xl text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-red-600 file:text-white hover:file:bg-red-700 transition-all">
                <p class="text-xs text-gray-500">Vertical image for movie cards (9:16 ratio recommended)</p>
                <div *ngIf="posterPreview" class="mt-2">
                  <img [src]="posterPreview" alt="Poster preview" class="w-32 h-48 object-cover rounded-lg border border-white/10">
                </div>
              </div>
            </div>

            <!-- Banner Image Upload -->
            <div>
              <label class="block text-sm font-medium text-gray-300 mb-2">Banner Image *</label>
              <div class="space-y-2">
                <input type="file" (change)="onBannerFileChange($event)" accept="image/*"
                       class="w-full px-4 py-3 bg-[#0a0f1e] border border-white/10 rounded-xl text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-red-600 file:text-white hover:file:bg-red-700 transition-all">
                <p class="text-xs text-gray-500">Wide banner for homepage showcase (16:9 ratio recommended)</p>
                <div *ngIf="bannerPreview" class="mt-2">
                  <img [src]="bannerPreview" alt="Banner preview" class="w-full h-24 object-cover rounded-lg border border-white/10">
                </div>
              </div>
            </div>
          </div>

          <!-- Trailer URL -->
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2">YouTube Trailer URL (Optional)</label>
            <input type="url" formControlName="trailerUrl"
                   class="w-full px-4 py-3 bg-[#0a0f1e] border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-red-500 transition-all"
                   placeholder="https://youtube.com/watch?v=...">
            <p class="text-xs text-gray-500 mt-1">YouTube video link for the trailer</p>
          </div>

          <!-- Buttons -->
          <div class="flex justify-end gap-4 pt-6 border-t border-white/10">
            <button type="button" (click)="goBack()"
                    class="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-xl font-semibold transition-all">
              Cancel
            </button>
            <button type="submit" [disabled]="movieForm.invalid || loading"
                    class="px-6 py-3 bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-semibold transition-all transform hover:-translate-y-0.5 shadow-lg shadow-red-900/20">
              {{ loading ? 'Saving...' : (isEditMode ? 'Update Movie' : 'Add Movie') }}
            </button>
          </div>
        </form>
      </div>
    </div>
  `
})
export class MovieFormComponent implements OnInit {
  movieForm: FormGroup;
  isEditMode = false;
  movieId: number | null = null;
  loading = false;
  error = '';
  successMessage = '';
  posterFile: File | null = null;
  bannerFile: File | null = null;
  posterPreview: string | null = null;
  bannerPreview: string | null = null;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.movieForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      crew: ['', Validators.required],
      genre: ['', Validators.required],
      durationMinutes: ['', [Validators.required, Validators.min(1)]],
      parentalRating: ['', Validators.required],
      language: ['', Validators.required],
      releaseDate: ['', Validators.required],
      cast: [''],
      trailerUrl: [''],
      rating: [0]
    });
  }

  ngOnInit() {
    this.movieId = this.route.snapshot.params['id'];
    if (this.movieId) {
      this.isEditMode = true;
      this.loadMovie();
    }
  }

  loadMovie() {
    this.http.get<any>(`${environment.apiUrl}/admin/movies/${this.movieId}`).subscribe({
      next: (response) => {
        const movie = response.data || response;
        this.movieForm.patchValue(movie);
        if (movie.displayImageUrl) {
          this.posterPreview = `http://localhost:8081${movie.displayImageUrl}`;
        }
        if (movie.bannerImageUrl) {
          this.bannerPreview = `http://localhost:8081${movie.bannerImageUrl}`;
        }
      }
    });
  }

  onPosterFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.posterFile = file;
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.posterPreview = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  onBannerFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.bannerFile = file;
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.bannerPreview = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  onSubmit() {
    if (this.movieForm.invalid) {
      Object.keys(this.movieForm.controls).forEach(key => {
        this.movieForm.get(key)?.markAsTouched();
      });
      return;
    }

    if (!this.isEditMode && !this.posterFile) {
      this.error = 'Please upload a display image (poster)';
      return;
    }

    if (!this.isEditMode && !this.bannerFile) {
      this.error = 'Please upload a banner image';
      return;
    }

    this.loading = true;
    this.error = '';
    this.successMessage = '';

    const formData = new FormData();
    
    // Append all form fields individually (backend expects @RequestParam)
    formData.append('title', this.movieForm.value.title);
    formData.append('description', this.movieForm.value.description);
    formData.append('crew', this.movieForm.value.crew || '');
    formData.append('genre', this.movieForm.value.genre);
    formData.append('duration', this.movieForm.value.durationMinutes.toString());
    formData.append('parentalRating', this.movieForm.value.parentalRating);
    formData.append('language', this.movieForm.value.language);
    formData.append('releaseDate', this.movieForm.value.releaseDate);
    formData.append('cast', this.movieForm.value.cast || '');
    formData.append('trailerUrl', this.movieForm.value.trailerUrl || '');

    // Append files
    if (this.posterFile) {
      formData.append('displayImage', this.posterFile);
    }
    if (this.bannerFile) {
      formData.append('bannerImage', this.bannerFile);
    }

    const request = this.isEditMode 
      ? this.http.put(`${environment.apiUrl}/admin/movies/${this.movieId}`, formData)
      : this.http.post(`${environment.apiUrl}/admin/movies`, formData);

    request.subscribe({
      next: () => {
        this.successMessage = this.isEditMode ? 'Movie updated successfully!' : 'Movie added successfully!';
        this.loading = false;
        setTimeout(() => {
          this.router.navigate(['/admin/movies']);
        }, 1500);
      },
      error: (err) => {
        console.error('Error saving movie:', err);
        this.error = err.error?.message || 'Failed to save movie. Please try again.';
        this.loading = false;
      }
    });
  }

  goBack() {
    this.router.navigate(['/admin/movies']);
  }
}
