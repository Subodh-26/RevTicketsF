import { Component, OnInit, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { MovieService } from '../../core/services/movie.service';
import { EventService } from '../../core/services/event.service';
import { AuthService } from '../../core/services/auth.service';

interface HeroMovie {
  id: number;
  title: string;
  subtitle?: string;
  description: string;
  image: string;
  rating: number;
  year: number;
  duration: string;
  genre: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="min-h-screen bg-[#050505] text-white font-sans selection:bg-red-600 selection:text-white overflow-x-hidden">
      
      <!-- Background Ambient Glows -->
      <div class="fixed top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div class="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-red-900/10 rounded-full blur-[120px]"></div>
        <div class="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-900/5 rounded-full blur-[120px]"></div>
      </div>

      <!-- Hero Carousel Section -->
      <header class="relative w-full h-[110vh] min-h-[800px] overflow-hidden -mt-20 group/hero" 
              (mouseenter)="pauseCarousel()" 
              (mouseleave)="resumeCarousel()">
        
        <!-- Empty/Loading State -->
        @if (heroMovies().length === 0) {
          <div class="absolute inset-0 bg-gradient-to-br from-[#1a1a1a] to-[#050505] flex items-center justify-center">
            <div class="text-center">
              <div class="inline-block animate-spin rounded-full h-16 w-16 border-4 border-red-600 border-t-transparent mb-4"></div>
              <p class="text-xl text-gray-400">Loading featured movies...</p>
            </div>
          </div>
        }
        
        <!-- Carousel Track -->
        @if (heroMovies().length > 0) {
          <div class="flex w-full h-full transition-transform duration-1000 ease-in-out will-change-transform"
               [style.transform]="'translateX(-' + (currentHeroIndex() * 100) + '%)'">
               
            @for (movie of heroMovies(); track movie.id; let idx = $index) {
            <div class="w-full h-full flex-shrink-0 relative">
              <!-- Background Image -->
              <div class="absolute inset-0">
                 <div class="absolute inset-0 bg-black/30 z-10"></div>
                 <img [src]="movie.image" 
                      class="w-full h-full object-cover opacity-80 origin-center"
                      [class.animate-slow-pan]="currentHeroIndex() === idx"
                      alt="Hero Background">
                 <!-- Gradient Overlays -->
                 <div class="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/60 to-transparent z-20"></div>
                 <div class="absolute inset-0 bg-gradient-to-r from-[#050505] via-[#050505]/80 to-transparent z-20"></div>
              </div>

              <!-- Content -->
              <div class="container mx-auto px-4 md:px-8 relative z-30 pt-32 h-full flex flex-col justify-center">
                 <div class="max-w-4xl animate-fade-in-up">
                    
                    <!-- Trending Tag -->
                    <div class="inline-flex items-center gap-2 px-4 py-2 mb-6 rounded-full bg-white/5 backdrop-blur-md border border-white/10 shadow-2xl">
                      <span class="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                      <span class="text-xs font-bold tracking-widest uppercase text-red-400">Top Trending Today</span>
                    </div>

                    <!-- Title -->
                    <h1 class="text-5xl md:text-8xl font-black mb-6 leading-[0.9] tracking-tight drop-shadow-2xl uppercase">
                      {{movie.title}}<br/>
                      @if (movie.subtitle) {
                        <span class="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-red-500 to-red-800">{{movie.subtitle}}</span>
                      }
                    </h1>
                    
                    <!-- Meta Data -->
                    <div class="flex flex-wrap items-center gap-6 text-sm md:text-lg font-medium text-gray-300 mb-8">
                      <span>{{movie.year}}</span>
                      <span>{{movie.duration}}</span>
                      <span class="px-3 py-1 border border-white/20 rounded text-xs uppercase tracking-wider">{{movie.genre}}</span>
                    </div>

                    <!-- Description -->
                    <p class="text-gray-300 text-lg md:text-xl mb-10 leading-relaxed max-w-2xl line-clamp-3 md:line-clamp-none drop-shadow-md">
                      {{movie.description}}
                    </p>

                    <!-- Actions -->
                    <div class="flex flex-wrap gap-4">
                      <a [routerLink]="['/movies', movie.id]" class="text-white/70 hover:text-white text-base font-medium underline underline-offset-4 hover:underline-offset-8 transition-all">
                        Know More
                      </a>
                    </div>
                 </div>
              </div>
            </div>
          }
          </div>
        }

        <!-- Carousel Controls -->
        @if (heroMovies().length > 1) {
          <div class="absolute bottom-32 right-4 md:right-16 z-40 flex gap-3">
             @for (movie of heroMovies(); track movie.id; let i = $index) {
               <button (click)="setHeroIndex(i)" 
                       class="h-2 rounded-full transition-all duration-500 shadow-lg"
                       [ngClass]="currentHeroIndex() === i ? 'bg-red-600 w-8' : 'bg-white/30 hover:bg-white w-2'">
               </button>
             }
          </div>
        }

      </header>

      <!-- Now Showing Section -->
      <section class="relative py-24 container mx-auto px-4 md:px-8 z-40">
        <div class="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
          <div>
            <div class="flex items-center gap-3 mb-2">
               <span class="h-[2px] w-10 bg-red-600"></span>
               <span class="text-red-500 font-bold uppercase tracking-widest text-sm">Now Playing</span>
            </div>
            <h2 class="text-4xl md:text-5xl font-bold text-white">Now Showing</h2>
          </div>
          
          <a routerLink="/movies" class="group inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
            <span>View All</span>
            <svg class="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
          </a>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          @for (movie of movies; track movie.movieId) {
            <div class="group relative bg-[#121212] rounded-3xl overflow-hidden border border-white/5 hover:border-red-500/50 transition-all duration-500 hover:-translate-y-3 hover:shadow-2xl hover:shadow-red-900/10">
              <!-- Poster -->
              <div class="relative aspect-[2/3] overflow-hidden">
                <img [src]="getImageUrl(movie.displayImageUrl)" [alt]="movie.title" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 group-hover:rotate-1">
                <div class="absolute inset-0 bg-gradient-to-t from-[#121212] via-transparent to-transparent opacity-60 group-hover:opacity-90 transition-opacity duration-300"></div>
              </div>

              <!-- Content -->
              <div class="absolute bottom-0 left-0 w-full p-6 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                <h3 class="text-2xl font-bold mb-2 text-white group-hover:text-red-500 transition-colors truncate">{{movie.title}}</h3>
                <div class="flex items-center gap-3 mb-4 text-gray-400 text-sm font-medium">
                   <span>{{movie.genre}}</span>
                   <span class="w-1 h-1 rounded-full bg-gray-600"></span>
                   <span>{{movie.durationMinutes}} min</span>
                </div>
                
                <a [routerLink]="['/movies', movie.movieId]" class="block w-full py-3 bg-white/10 hover:bg-red-600 text-white rounded-xl font-semibold transition-colors backdrop-blur-md border border-white/10 group-hover:border-red-500/50 text-center">
                  Book Ticket
                </a>
              </div>
            </div>
          }
        </div>
      </section>

      <!-- Upcoming Events -->
      <section class="py-24 bg-gradient-to-b from-[#0a0a0a] to-[#050505] border-y border-white/5 relative overflow-hidden">
        <!-- Background Pattern -->
        <div class="absolute inset-0 opacity-5" style="background-image: radial-gradient(#ffffff 1px, transparent 1px); background-size: 40px 40px;"></div>

        <div class="container mx-auto px-4 md:px-8 relative z-10">
          <div class="flex flex-col md:flex-row justify-between items-end mb-12">
            <div>
               <h2 class="text-3xl md:text-5xl font-bold mb-2"><span class="text-red-600">Upcoming</span> Events</h2>
               <p class="text-gray-400">Live concerts, sports & special performances</p>
            </div>
            <a routerLink="/events" class="group inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
              <span>View All</span>
              <svg class="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
            </a>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            @for (event of events; track event.eventId) {
              <div class="group relative bg-[#121212] rounded-3xl overflow-hidden border border-white/5 hover:border-red-500/50 transition-all duration-500 hover:-translate-y-3 hover:shadow-2xl">
                <div class="relative h-48 overflow-hidden">
                  <img [src]="getImageUrl(event.displayImageUrl)" [alt]="event.title" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110">
                  <div class="absolute inset-0 bg-gradient-to-t from-[#121212] to-transparent"></div>
                </div>
                <div class="p-6">
                  <h4 class="text-xl font-bold mb-2 group-hover:text-red-500 transition-colors">{{event.title}}</h4>
                  <p class="text-gray-400 text-sm mb-2">{{event.category}}</p>
                  <p class="text-gray-500 text-xs mb-4">{{event.eventDate | date}} | {{event.artistOrTeam}}</p>
                  <a [routerLink]="['/events', event.eventId]" class="block w-full py-3 bg-white/10 hover:bg-red-600 text-white rounded-xl font-semibold transition-colors text-center">
                    Book Now
                  </a>
                </div>
              </div>
            }
          </div>
        </div>
      </section>

      <!-- Footer -->
      <footer class="pt-20 pb-10 border-t border-white/5 bg-[#020202]">
        <div class="container mx-auto px-4 md:px-8">
          <div class="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-gray-600 text-xs font-medium uppercase tracking-wider">
            <p>© 2024 RevTickets. All Rights Reserved.</p>
            <div class="flex gap-6">
              <a href="#" class="hover:text-gray-400 transition-colors">Privacy</a>
              <a href="#" class="hover:text-gray-400 transition-colors">Terms</a>
              <a href="#" class="hover:text-gray-400 transition-colors">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  `,
  styles: [`
    @keyframes fade-in-up {
      from { opacity: 0; transform: translateY(30px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .animate-fade-in-up {
      animation: fade-in-up 1s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }
    @keyframes slow-pan {
      0% { transform: scale(1.05); }
      50% { transform: scale(1.1); }
      100% { transform: scale(1.05); }
    }
    .animate-slow-pan {
      animation: slow-pan 20s ease-in-out infinite;
    }
    @keyframes shimmer {
      100% { transform: translateX(100%); }
    }
    .animate-shimmer {
      animation: shimmer 2s infinite;
    }
  `]
})
export class HomeComponent implements OnInit, OnDestroy {
  movies: any[] = [];
  events: any[] = [];
  currentHeroIndex = signal(0);
  heroInterval: any;

  heroMovies = signal<HeroMovie[]>([]);

  constructor(
    private movieService: MovieService,
    private eventService: EventService,
    public router: Router,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.loadBanners();
    this.loadMovies();
    this.loadEvents();
  }

  ngOnDestroy() {
    this.stopCarousel();
  }

  startCarousel() {
    this.heroInterval = setInterval(() => {
      this.nextHero();
    }, 6000);
  }

  stopCarousel() {
    if (this.heroInterval) {
      clearInterval(this.heroInterval);
    }
  }

  pauseCarousel() {
    this.stopCarousel();
  }

  resumeCarousel() {
    this.startCarousel();
  }

  nextHero() {
    const length = this.heroMovies().length;
    if (length > 0) {
      this.currentHeroIndex.update(i => (i + 1) % length);
    }
  }

  setHeroIndex(index: number) {
    this.currentHeroIndex.set(index);
    this.stopCarousel();
    this.startCarousel();
  }

  loadBanners() {
    console.log('🎬 Loading banners...');
    const banners: HeroMovie[] = [];
    
    // Load movies first (max 3 for banners to leave room for 1 event)
    this.movieService.getNowShowingMovies().subscribe({
      next: (movieResponse) => {
        console.log('📦 Movies API Response:', movieResponse);
        const movies = (movieResponse.data || []).slice(0, 3); // Limit to 3 movies
        console.log('🎥 Movies for banners (max 3):', movies.length);
        
        movies.forEach((movie: any) => {
          const imageUrl = movie.bannerImageUrl || movie.displayImageUrl;
          const fullImageUrl = imageUrl ? this.movieService.getImageUrl(imageUrl) : 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=1000';
          banners.push({
            id: movie.movieId,
            title: movie.title.split(' ').slice(0, 2).join(' ').toUpperCase(),
            subtitle: movie.title.split(' ').slice(2).join(' ').toUpperCase() || '',
            description: movie.description,
            image: fullImageUrl,
            rating: movie.rating || 0,
            year: new Date(movie.releaseDate).getFullYear(),
            duration: `${Math.floor(movie.durationMinutes / 60)}h ${movie.durationMinutes % 60}m`,
            genre: movie.genre
          });
        });
        
        // Load events if we have space (max 1 event, total max 4 banners)
        if (banners.length < 4) {
          this.eventService.getUpcomingEvents().subscribe({
            next: (eventResponse) => {
              const remainingSlots = 4 - banners.length; // Calculate remaining slots
              const events = (eventResponse.data || []).slice(0, Math.min(1, remainingSlots)); // Max 1 event
              console.log('🎪 Events for banners (max 1, remaining slots: ' + remainingSlots + '):', events.length);
              
              events.forEach((event: any) => {
                if (banners.length < 4) {
                  const imageUrl = event.bannerImageUrl || event.displayImageUrl;
                  const fullImageUrl = imageUrl ? this.eventService.getImageUrl(imageUrl) : 'https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?q=80&w=1000';
                  banners.push({
                    id: event.eventId,
                    title: event.title.split(' ').slice(0, 2).join(' ').toUpperCase(),
                    subtitle: event.title.split(' ').slice(2).join(' ').toUpperCase() || '',
                    description: event.description || `${event.category} event featuring ${event.artistOrTeam}`,
                    image: fullImageUrl,
                    rating: 0,
                    year: new Date(event.eventDate).getFullYear(),
                    duration: event.category,
                    genre: event.category
                  });
                }
              });
              
              console.log('✅ Total banners:', banners.length);
              this.heroMovies.set(banners);
              if (banners.length > 0) this.startCarousel();
            },
            error: () => {
              console.log('✅ Using movie banners only:', banners.length);
              this.heroMovies.set(banners);
              if (banners.length > 0) this.startCarousel();
            }
          });
        } else {
          console.log('✅ Using movie banners only:', banners.length);
          this.heroMovies.set(banners);
          if (banners.length > 0) this.startCarousel();
        }
      },
      error: (err) => {
        console.error('❌ Error loading banners:', err);
        this.heroMovies.set([]);
      }
    });
  }

  loadMovies() {
    console.log('🎬 Loading movies...');
    this.movieService.getNowShowingMovies().subscribe({
      next: (response) => {
        console.log('📦 Movies API Response:', response);
        this.movies = response.data.slice(0, 4);
        console.log('🎥 Loaded movies for cards:', this.movies);
      },
      error: (err) => {
        console.error('❌ Error loading movies:', err);
        this.movies = [];
      }
    });
  }

  getImageUrl(path: string): string {
    return this.movieService.getImageUrl(path);
  }

  loadEvents() {
    console.log('🎪 Loading events...');
    this.eventService.getUpcomingEvents().subscribe({
      next: (response) => {
        console.log('📦 Events API Response:', response);
        const allEvents = response.data || response || [];
        console.log('📦 All events from API:', allEvents.length);
        this.events = allEvents.slice(0, 3);
        console.log('🎪 Loaded events for display:', this.events.length, this.events);
      },
      error: (err) => {
        console.error('❌ Error loading events:', err);
        this.events = [];
      }
    });
  }
}
