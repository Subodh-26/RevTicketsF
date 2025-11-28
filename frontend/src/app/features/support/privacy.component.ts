import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-privacy',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="min-h-screen bg-[#050505] text-white py-20">
      <div class="container mx-auto px-4 max-w-4xl">
        <h1 class="text-4xl font-bold mb-8">Privacy Policy</h1>
        <div class="space-y-6 text-gray-300">
          <section>
            <h2 class="text-2xl font-semibold text-white mb-3">1. Information Collection</h2>
            <p>We collect personal information including name, email, and payment details for booking purposes.</p>
          </section>
          <section>
            <h2 class="text-2xl font-semibold text-white mb-3">2. Data Usage</h2>
            <p>Your data is used solely for processing bookings and improving our services.</p>
          </section>
          <section>
            <h2 class="text-2xl font-semibold text-white mb-3">3. Data Security</h2>
            <p>We implement industry-standard security measures to protect your information.</p>
          </section>
          <section>
            <h2 class="text-2xl font-semibold text-white mb-3">4. Third-Party Sharing</h2>
            <p>We do not sell or share your personal information with third parties without consent.</p>
          </section>
        </div>
      </div>
    </div>
  `
})
export class PrivacyComponent {}
