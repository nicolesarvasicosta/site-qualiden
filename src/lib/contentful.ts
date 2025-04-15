import { createClient } from 'contentful';

export const contentfulClient = createClient({
  space: import.meta.env.VITE_CONTENTFUL_SPACE_ID as string,
  accessToken: import.meta.env.VITE_CONTENTFUL_ACCESS_TOKEN as string,
});

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