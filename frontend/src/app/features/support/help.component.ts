import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-help',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="min-h-screen bg-[#050505] text-white py-20">
      <div class="container mx-auto px-4 max-w-4xl">
        <h1 class="text-4xl font-bold mb-8">Help Center</h1>
        <div class="space-y-4">
          @for (item of helpItems; track item.title) {
            <div class="bg-white/5 border border-white/10 rounded-lg p-6">
              <h3 class="text-xl font-semibold mb-2">{{item.title}}</h3>
              <p class="text-gray-400">{{item.content}}</p>
            </div>
          }
        </div>
      </div>
    </div>
  `
})
export class HelpComponent {
  helpItems = [
    { title: 'How to book tickets?', content: 'Select a movie or event, choose your seats, and proceed to payment.' },
    { title: 'How to cancel booking?', content: 'Go to My Bookings and click Cancel on your booking.' },
    { title: 'Refund policy?', content: 'Refunds are processed within 5-7 business days after cancellation.' },
    { title: 'Payment methods?', content: 'We accept credit cards, debit cards, and online payment methods.' }
  ];
}
