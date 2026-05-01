'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="border-b border-border bg-card">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="text-xl font-bold text-foreground">
            Convert to mp4
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="/"
              className="text-sm font-medium text-foreground hover:text-primary transition-colors"
            >
              Converter
            </Link>
            <Link
              href="/library"
              className="text-sm font-medium text-foreground hover:text-primary transition-colors"
            >
              Library
            </Link>
          </nav>

          <button
            type="button"
            className="md:hidden inline-flex items-center justify-center rounded-md p-2 text-foreground hover:bg-muted"
            aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
            onClick={() => setIsMenuOpen((prev) => !prev)}
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {isMenuOpen && (
        <nav className="md:hidden border-t border-border bg-card">
          <div className="mx-auto max-w-7xl px-4 py-3 space-y-2 sm:px-6 lg:px-8">
            <Link
              href="/"
              className="block rounded-md px-3 py-2 text-sm font-medium text-foreground hover:bg-muted"
              onClick={() => setIsMenuOpen(false)}
            >
              Converter
            </Link>
            <Link
              href="/library"
              className="block rounded-md px-3 py-2 text-sm font-medium text-foreground hover:bg-muted"
              onClick={() => setIsMenuOpen(false)}
            >
              Library
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}
