import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="min-h-screen bg-[#050505] text-white py-20">
      <div class="container mx-auto px-4 max-w-2xl">
        <h1 class="text-4xl font-bold mb-8">Contact Us</h1>
        <form (ngSubmit)="onSubmit()" class="space-y-6">
          <div>
            <label class="block mb-2">Name</label>
            <input [(ngModel)]="form.name" name="name" required class="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 focus:outline-none focus:border-red-500">
          </div>
          <div>
            <label class="block mb-2">Email</label>
            <input [(ngModel)]="form.email" name="email" type="email" required class="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 focus:outline-none focus:border-red-500">
          </div>
          <div>
            <label class="block mb-2">Message</label>
            <textarea [(ngModel)]="form.message" name="message" required rows="5" class="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 focus:outline-none focus:border-red-500"></textarea>
          </div>
          <button type="submit" class="w-full bg-red-600 hover:bg-red-700 py-3 rounded-lg font-semibold transition-colors">Send Message</button>
        </form>
        @if (submitted) {
          <div class="mt-4 p-4 bg-green-600/20 border border-green-600 rounded-lg">Message sent successfully!</div>
        }
      </div>
    </div>
  `
})
export class ContactComponent {
  form = { name: '', email: '', message: '' };
  submitted = false;

  onSubmit() {
    console.log('Contact form:', this.form);
    this.submitted = true;
    setTimeout(() => this.submitted = false, 3000);
  }
}
