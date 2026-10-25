import { createClient, ContentfulClientApi } from 'contentful';

let client: ContentfulClientApi<undefined> | null = null;

// Created on first use: createClient throws when the keys are missing, and doing
// that at import time would blank the whole site instead of just the catalog.
export function getContentfulClient() {
  if (!client) {
    client = createClient({
      space: import.meta.env.VITE_CONTENTFUL_SPACE_ID as string,
      accessToken: import.meta.env.VITE_CONTENTFUL_ACCESS_TOKEN as string,
    });
  }
  return client;
}

export interface ContentfulAsset {
  fields: {
    file: {
      url: string;
      fileName: string;
      contentType: string;
    };
    title?: string;
    description?: string;
  };
}

export interface ContentfulProduct {
  sys: {
    id: string;
  };
  fields: {
    name: string;
    description?: string;
    category?: string;
    subcategory?: string;
    product?: string;
    productMedia?: ContentfulAsset;
  };
}

export interface ContentfulCategory {
  sys: {
    id: string;
  };
  fields: {
    name: string;
    description?: string;
    category: string;
    subcategory: string;
    product: string;
    productMedia?: ContentfulAsset;
  };
}