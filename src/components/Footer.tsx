import React from 'react';

export function Footer() {
  return (
    <footer className="bg-university-blue text-on-primary">
      <div className="w-full py-stack-xl px-margin-desktop grid grid-cols-1 md:grid-cols-4 gap-gutter max-w-container-max mx-auto">
        <div className="space-y-6">
          <h3 className="font-headline-sm text-headline-sm font-bold text-academic-gold">UniEvents</h3>
          <p className="text-surface-variant text-label-sm max-w-xs">The premier event ticketing platform built exclusively for the university community. Empowering student connection through experiences.</p>
          <div className="flex gap-4">
            <a className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-academic-gold transition-colors text-white" href="#">
              <span className="material-symbols-outlined">share</span>
            </a>
            <a className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-academic-gold transition-colors text-white" href="#">
              <span className="material-symbols-outlined">hub</span>
            </a>
            <a className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-academic-gold transition-colors text-white" href="#">
              <span className="material-symbols-outlined">alternate_email</span>
            </a>
          </div>
        </div>
        <div>
          <h4 className="text-white font-bold mb-6 font-title-lg">Platform</h4>
          <ul className="space-y-4 font-label-sm text-label-sm">
            <li><a className="text-surface-variant hover:text-academic-gold transition-all" href="#">Explore Events</a></li>
            <li><a className="text-surface-variant hover:text-academic-gold transition-all" href="#">University Partners</a></li>
            <li><a className="text-surface-variant hover:text-academic-gold transition-all" href="#">Ticket Verification</a></li>
            <li><a className="text-surface-variant hover:text-academic-gold transition-all" href="#">Faculty Dashboard</a></li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-bold mb-6 font-title-lg">Resources</h4>
          <ul className="space-y-4 font-label-sm text-label-sm">
            <li><a className="text-surface-variant hover:text-academic-gold transition-all" href="#">Help Center</a></li>
            <li><a className="text-surface-variant hover:text-academic-gold transition-all" href="#">Event Guidelines</a></li>
            <li><a className="text-surface-variant hover:text-academic-gold transition-all" href="#">Privacy Policy</a></li>
            <li><a className="text-surface-variant hover:text-academic-gold transition-all" href="#">Terms of Service</a></li>
            <li><a className="text-surface-variant hover:text-academic-gold transition-all" href="#">Contact Us</a></li>
          </ul>
        </div>
        <div className="space-y-6">
          <h4 className="text-white font-bold mb-6 font-title-lg">Stay Updated</h4>
          <p className="text-surface-variant text-label-sm">Get the weekly campus digest delivered to your inbox.</p>
          <form className="flex flex-col gap-3">
            <input className="bg-white/10 border-white/20 rounded-xl px-4 py-3 text-white focus:ring-academic-gold focus:border-academic-gold" placeholder="student@university.edu" type="email" />
            <button className="bg-academic-gold text-university-blue font-bold py-3 rounded-xl hover:opacity-90 transition-opacity">Subscribe</button>
          </form>
        </div>
      </div>
      <div className="border-t border-primary-container max-w-container-max mx-auto px-margin-desktop py-8 flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-surface-variant text-label-sm opacity-80">© 2024 UniEvents Ticketing. All rights reserved.</p>
        <div className="flex gap-8 text-surface-variant text-label-sm font-semibold">
          <a className="hover:text-white" href="#">Partners</a>
          <a className="hover:text-white" href="#">API Access</a>
          <a className="hover:text-white" href="#">Sponsorships</a>
        </div>
      </div>
    </footer>
  );
}
