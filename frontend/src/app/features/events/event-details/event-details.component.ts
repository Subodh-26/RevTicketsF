import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

interface Review {
  userName: string;
  rating: number;
  reviewText: string;
  createdAt: string;
  tags?: string[];
}

@Component({
  selector: 'app-event-details',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="min-h-screen bg-[#050505]" *ngIf="event">
      <!-- Hero Section with Banner Background -->
      <div class="relative h-[70vh] overflow-hidden">
        <!-- Banner Image -->
        <img 
          [src]="getImageUrl(event.bannerImageUrl)" 
          [alt]="event.title"
          class="absolute inset-0 w-full h-full object-cover opacity-70 scale-110"
        />
        
        <!-- Gradient Overlays -->
        <div class="absolute inset-0 bg-gradient-to-b from-[#050505]/20 via-[#050505]/40 to-[#050505]"></div>
        <div class="absolute inset-0 bg-gradient-to-r from-[#050505] via-transparent to-[#050505]/50"></div>
        
        <!-- Content -->
        <div class="relative h-full container mx-auto px-4 flex items-end pb-12">
          <div class="flex gap-8 w-full">
            <!-- Poster -->
            <div class="relative flex-shrink-0">
              <img 
                [src]="getImageUrl(event.displayImageUrl)" 
                [alt]="event.title"
                class="w-64 rounded-2xl shadow-2xl"
              />
              <div class="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-red-600 text-white px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap">
                Live Event
              </div>
            </div>
            
            <!-- Info -->
            <div class="flex-1 text-white">
              <h1 class="text-5xl font-bold mb-4 drop-shadow-lg">{{ event.title }}</h1>
              
              <div class="flex flex-wrap gap-3 mb-6">
                <span class="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm border border-white/20">
                  {{ event.category }}
                </span>
                <span class="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm border border-white/20">
                  {{ event.durationMinutes }} min
                </span>
                <span class="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm border border-white/20">
                  {{ event.language }}
                </span>
                <span *ngIf="event.ageRestriction" class="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm border border-white/20">
                  {{ event.ageRestriction }}
                </span>
              </div>
              
              <div class="flex items-center gap-6 mb-8">
                <div class="flex items-center gap-2">
                  <svg class="w-6 h-6 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                  </svg>
                  <span class="text-xl font-semibold">{{ averageRating.toFixed(1) }}/5</span>
                  <span class="text-gray-400">({{ totalReviews }} reviews)</span>
                </div>
              </div>
              
              <button 
                (click)="selectShow()" 
                class="bg-red-600 hover:bg-red-700 text-white px-10 py-4 rounded-xl text-lg font-semibold transition-colors shadow-lg shadow-red-600/50">
                Book Tickets
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Main Content -->
      <div class="container mx-auto px-4 py-12">
        <!-- About -->
        <section class="mb-12">
          <h2 class="text-3xl font-bold text-white mb-6">About the Event</h2>
          <div class="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
            <p class="text-gray-300 text-lg leading-relaxed mb-6">{{ event.description }}</p>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="flex items-start gap-3">
                <div class="w-10 h-10 bg-red-600/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg class="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                  </svg>
                </div>
                <div>
                  <p class="text-gray-400 text-sm">Artist/Team</p>
                  <p class="text-white font-semibold">{{ event.artistOrTeam }}</p>
                </div>
              </div>
              
              <div class="flex items-start gap-3">
                <div class=\"w-10 h-10 bg-red-600/20 rounded-lg flex items-center justify-center flex-shrink-0\">
                  <svg class=\"w-5 h-5 text-red-500\" fill=\"none\" stroke=\"currentColor\" viewBox=\"0 0 24 24\">
                    <path stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2\" d=\"M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z\"/>
                  </svg>
                </div>
                <div>
                  <p class=\"text-gray-400 text-sm\">Event Date & Time</p>
                  <p class=\"text-white font-semibold\">{{ event.eventDate }} at {{ formatTime(event.eventTime) }}</p>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        <!-- Reviews Section -->
        <section class="mb-12">
          <h2 class="text-3xl font-bold text-white mb-6">Reviews</h2>
          
          <div *ngIf="loadingReviews" class="text-center py-8">
            <div class="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-red-500"></div>
          </div>
          
          <div *ngIf="!loadingReviews && reviews.length === 0" class="bg-white/5 backdrop-blur-sm rounded-2xl p-12 border border-white/10 text-center">
            <svg class="w-16 h-16 mx-auto text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"/>
            </svg>
            <p class="text-gray-400 text-lg">No reviews yet. Be the first to share your experience!</p>
          </div>
          
          <div *ngIf="!loadingReviews && reviews.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div *ngFor="let review of reviews" class="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-red-500/30 transition-colors">
              <div class="flex items-start gap-4 mb-4">
                <div class="w-12 h-12 bg-gradient-to-br from-red-500 to-pink-600 rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                  {{ review.userName.charAt(0).toUpperCase() }}
                </div>
                <div class="flex-1">
                  <h3 class="text-white font-semibold">{{ review.userName }}</h3>
                  <div class="flex items-center gap-1">
                    <svg *ngFor="let star of [1,2,3,4,5]" 
                         class="w-4 h-4" 
                         [class.text-yellow-400]="star <= review.rating"
                         [class.text-gray-600]="star > review.rating"
                         fill="currentColor" 
                         viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                    </svg>
                  </div>
                </div>
              </div>
              
              <p class="text-gray-300 mb-3">{{ review.reviewText }}</p>
              
              <div *ngIf="review.tags && review.tags.length > 0" class="flex flex-wrap gap-2">
                <span *ngFor="let tag of review.tags" class="px-3 py-1 bg-red-600/20 text-red-400 text-xs rounded-full border border-red-500/30">
                  {{ tag }}
                </span>
              </div>
              
              <p class="text-gray-500 text-sm mt-3">{{ review.createdAt | date:'MMM d, y' }}</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  `
})
export class EventDetailsComponent implements OnInit {
  event: any;
  eventId!: number;
  reviews: Review[] = [];
  loadingReviews = false;
  averageRating = 0;
  totalReviews = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit() {
    this.eventId = +this.route.snapshot.paramMap.get('id')!;
    this.loadEvent();
    this.loadReviews();
  }

  loadEvent() {
    this.http.get<any>(`${environment.apiUrl}/events/${this.eventId}`).subscribe({
      next: (response) => {
        this.event = response.data;
        console.log('Event loaded:', this.event);
      },
      error: (err) => {
        console.error('Error loading event:', err);
      }
    });
  }

  loadReviews() {
    this.loadingReviews = true;
    this.http.get<any>(`${environment.apiUrl}/reviews/event/${this.eventId}`).subscribe({
      next: (response) => {
        this.reviews = response.data || [];
        this.calculateAverageRating();
        this.loadingReviews = false;
      },
      error: () => {
        this.reviews = [];
        this.loadingReviews = false;
      }
    });
  }

  calculateAverageRating() {
    if (this.reviews.length === 0) {
      this.averageRating = 0;
      this.totalReviews = 0;
      return;
    }
    
    const sum = this.reviews.reduce((acc, review) => acc + review.rating, 0);
    this.averageRating = sum / this.reviews.length;
    this.totalReviews = this.reviews.length;
  }

  getImageUrl(path: string): string {
    if (!path) {
      console.log('No image path provided for event details, using placeholder');
      return 'assets/placeholder.jpg';
    }
    if (path.startsWith('http')) return path;
    // Backend returns paths like /display/filename.jpg or /banner/filename.jpg
    const fullUrl = `http://localhost:8081${path}`;
    console.log('Event detail image URL:', fullUrl, 'from path:', path);
    return fullUrl;
  }

  formatTime(time: any): string {
    if (!time) return '';
    if (typeof time === 'string') {
      return time.substring(0, 5); // \"HH:mm:ss\" -> \"HH:mm\"
    }
    if (Array.isArray(time)) {
      const [h, m] = time;
      return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
    }
    return '';
  }

  selectShow() {
    this.router.navigate(['/bookings/select-show'], { 
      queryParams: { eventId: this.eventId } 
    });
  }

  goBack() {
    this.router.navigate(['/events']);
  }
}
