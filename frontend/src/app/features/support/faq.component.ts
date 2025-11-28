import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-faq',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="min-h-screen bg-[#050505] text-white py-20">
      <div class="container mx-auto px-4 max-w-4xl">
        <h1 class="text-4xl font-bold mb-8">FAQs</h1>
        <div class="space-y-4">
          @for (faq of faqs; track faq.q) {
            <div class="bg-white/5 border border-white/10 rounded-lg p-6">
              <h3 class="text-lg font-semibold mb-2">{{faq.q}}</h3>
              <p class="text-gray-400">{{faq.a}}</p>
            </div>
          }
        </div>
      </div>
    </div>
  `
})
export class FaqComponent {
  faqs = [
    { q: 'Can I change my seat after booking?', a: 'No, seats cannot be changed once booked.' },
    { q: 'Is there a booking fee?', a: 'Yes, a small convenience fee is added to each booking.' },
    { q: 'Can I book for multiple people?', a: 'Yes, you can select multiple seats in one booking.' },
    { q: 'What if the show is cancelled?', a: 'Full refund will be processed automatically.' }
  ];
}
