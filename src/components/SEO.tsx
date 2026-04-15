
"use client";

import React from 'react';

interface JsonLdProps {
  data: any;
}

/**
 * SEO Structured Data Component
 * Renders JSON-LD for rich search results.
 */
export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
