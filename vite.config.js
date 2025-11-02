import { defineConfig } from 'vite'
import { resolve } from 'path';
import tailwindcss from '@tailwindcss/vite'
import handlebars from 'vite-plugin-handlebars';
import htmlMinifier from 'vite-plugin-html-minifier-terser'


const getImage = (entry, size = 500, width, height) => {
  const defaultUrl = 'https://placehold.co/320x200/png';
  let url = entry?.media$thumbnail?.url;
  if (!url) return defaultUrl;
  url = url.replace(
    /\/s\d+(-w\d+-h\d+(-[a-z])?-c)?\//,
    `/${buildSizeSegment(size, width, height)}/`
  );

  return url;
};

function buildSizeSegment(size, width, height) {
  let segment = `s${size}`;
  if (width && height) segment += `-w${width}-h${height}-c`;
  return segment;
}

async function fetchLatestPosts(limit = 5) {
  const feedUrl = 'https://blog.bareket.co/feeds/posts/default?alt=json';
  try {
    const _fetch = (typeof fetch !== 'undefined') ? fetch : (await import('node-fetch')).default;
    const res = await _fetch(feedUrl);
    if (!res.ok) return [];
    const data = await res.json();
    const entries = data?.feed?.entry || [];

    const posts = entries.slice(0, limit).map((entry) => {
      const excerptSource = entry.content?.$t || entry.summary?.$t || '';
      const textOnly = excerptSource.replace(/<[^>]*>/g, '').trim();
      const words = textOnly.split(/\s+/);
      const excerpt = words.slice(0, 20).join(' ') + (words.length > 20 ? '...' : '');
      const img = getImage(entry, 500, 312, 195);
      const url = (entry.link || []).find(l => l.rel === 'alternate')?.href
        || (entry.link && entry.link[2] && entry.link[2].href)
        || '#';

      return {
        title: entry.title?.$t || '',
        url,
        excerpt,
        img,
      };
    });

    // Pad to exactly `limit` items with placeholders so template logic is simple
    while (posts.length < limit) {
      const idx = posts.length + 1;
      posts.push({
        title: `Blog Post Title #${idx}`,
        url: '#',
        excerpt: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce viverra sem eros.',
        img: 'https://placehold.co/320x200/png',
      });
    }

    return posts;
  } catch (err) {
    console.error('Could not fetch blog feed at build time', err);
    // return padded placeholders on error
    const placeholders = [];
    for (let i = 1; i <= limit; i++) {
      placeholders.push({
        title: `Blog Post Title #${i}`,
        url: '#',
        excerpt: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce viverra sem eros.',
        img: 'https://placehold.co/320x200/png',
      });
    }
    return placeholders;
  }
}

const latestPosts = await fetchLatestPosts(3);


export default defineConfig({
  base: '/',
  plugins: [
    tailwindcss(),
    handlebars({
      partialDirectory: resolve(__dirname, 'src/partials'),
      context: {
        latestPosts,
      },
     helpers: {
       // length helper (inline + block)
       length: (value, options) => {
         const len = Array.isArray(value) ? value.length : (value ? String(value).length : 0);
         if (options && typeof options.fn === 'function') {
           return len ? options.fn(this) : options.inverse(this);
         }
         return len;
       },
       // comparison helpers (work as block {{#lt a b}}...{{/lt}} and inline {{lt a b}})
       lt: function(a, b, options) {
         const opts = arguments[arguments.length - 1];
         const val = a < b;
         if (opts && typeof opts.fn === 'function') return val ? opts.fn(this) : opts.inverse(this);
         return val;
       },
       lte: function(a, b, options) {
         const opts = arguments[arguments.length - 1];
         const val = a <= b;
         if (opts && typeof opts.fn === 'function') return val ? opts.fn(this) : opts.inverse(this);
         return val;
       },
       gt: function(a, b, options) {
         const opts = arguments[arguments.length - 1];
         const val = a > b;
         if (opts && typeof opts.fn === 'function') return val ? opts.fn(this) : opts.inverse(this);
         return val;
       },
       gte: function(a, b, options) {
         const opts = arguments[arguments.length - 1];
         const val = a >= b;
         if (opts && typeof opts.fn === 'function') return val ? opts.fn(this) : opts.inverse(this);
         return val;
       },
       eq: function(a, b, options) {
         const opts = arguments[arguments.length - 1];
         const val = a == b;
         if (opts && typeof opts.fn === 'function') return val ? opts.fn(this) : opts.inverse(this);
         return val;
       },
       neq: function(a, b, options) {
         const opts = arguments[arguments.length - 1];
         const val = a != b;
         if (opts && typeof opts.fn === 'function') return val ? opts.fn(this) : opts.inverse(this);
         return val;
       },
     },
    }),
    htmlMinifier({
      minifyOptions: {
        collapseWhitespace: true,
        removeComments: true,
        removeRedundantAttributes: true,
        removeEmptyAttributes: true,
        useShortDoctype: true,
      }
    })
  ],
  build: {
    minify: 'esbuild', // Disables all minification
    target: 'es2017',
    cssMinify: 'esbuild'
  },
})
