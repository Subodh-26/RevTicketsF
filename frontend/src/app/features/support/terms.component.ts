import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-terms',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="min-h-screen bg-[#050505] text-white py-20">
      <div class="container mx-auto px-4 max-w-4xl">
        <h1 class="text-4xl font-bold mb-8">Terms of Service</h1>
        <div class="space-y-6 text-gray-300">
          <section>
            <h2 class="text-2xl font-semibold text-white mb-3">1. Acceptance of Terms</h2>
            <p>By accessing and using RevTickets, you accept and agree to be bound by these Terms of Service.</p>
          </section>
          <section>
            <h2 class="text-2xl font-semibold text-white mb-3">2. Booking Policy</h2>
            <p>All bookings are subject to availability. Tickets once booked cannot be exchanged or transferred.</p>
          </section>
          <section>
            <h2 class="text-2xl font-semibold text-white mb-3">3. Cancellation</h2>
            <p>Cancellations must be made at least 2 hours before the show time to be eligible for refund.</p>
          </section>
          <section>
            <h2 class="text-2xl font-semibold text-white mb-3">4. User Conduct</h2>
            <p>Users must not misuse the platform or engage in fraudulent activities.</p>
          </section>
        </div>
      </div>
    </div>
  `
})
export class TermsComponent {}
