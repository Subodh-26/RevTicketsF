import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-event-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="min-h-screen bg-[#050505] pt-24">
      <div class="container mx-auto px-4 py-8">
        <h1 class="text-4xl font-bold mb-8 text-white">All Events</h1>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div *ngFor="let event of events" class="card hover:scale-105 transform transition">
            <img 
              [src]="getImageUrl(event.displayImageUrl)" 
              [alt]="event.title"
              class="w-full h-48 object-cover rounded-lg mb-4"
            />
            <h3 class="text-xl font-bold mb-2">{{ event.title }}</h3>
            <p class="text-gray-400 text-sm mb-2">{{ event.category }}</p>
            <div class="text-xs text-gray-500 mb-4">
              <p>{{ event.eventDate }} at {{ formatTime(event.eventTime) }}</p>
              <p>{{ event.artistOrTeam }}</p>
            </div>
            <a [routerLink]="['/events', event.eventId]" class="btn btn-primary w-full">View Details</a>
          </div>
        </div>
      </div>
    </div>
  `
})
export class EventListComponent implements OnInit {
  events: any[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.http.get<any>(`${environment.apiUrl}/events`).subscribe({
      next: (response) => {
        this.events = response.data;
        console.log('Events loaded:', this.events);
      },
      error: (err) => {
        console.error('Error loading events:', err);
      }
    });
  }

  getImageUrl(path: string): string {
    if (!path) {
      console.log('No image path provided, using placeholder');
      return 'assets/placeholder.jpg';
    }
    if (path.startsWith('http')) return path;
    // Backend returns paths like /display/filename.jpg or /banner/filename.jpg
    const fullUrl = `http://localhost:8081${path}`;
    console.log('Event image URL:', fullUrl, 'from path:', path);
    return fullUrl;
  }

  formatTime(time: any): string {
    if (!time) return '';
    if (typeof time === 'string') {
      return time.substring(0, 5); // "HH:mm:ss" -> "HH:mm"
    }
    if (Array.isArray(time)) {
      const [h, m] = time;
      return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
    }
    return '';
  }
}
