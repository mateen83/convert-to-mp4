'use client';

import { FileVideo } from 'lucide-react';
import Link from 'next/link';

export function Navbar() {
  return (
    <nav className="border-b border-border bg-card">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            {/* <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
              <FileVideo className="h-6 w-6 text-primary-foreground" />
            </div> */}
            <h1 className="text-xl font-bold text-foreground">Convert to mp4</h1>
          </Link>

          <div className="flex items-center gap-4">
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
          </div>
        </div>
      </div>
    </nav>
  );
}
