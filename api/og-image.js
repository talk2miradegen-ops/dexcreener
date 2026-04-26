export const config = {
  runtime: 'edge',
};

import { ImageResponse } from '@vercel/og';
import React from 'react';

export default async function handler(request) {
  try {
    const { searchParams } = new URL(request.url);
    const ca = searchParams.get('ca');

    if (!ca) {
      return new Response('Missing token address', { status: 400 });
    }

    // Fetch token data from DexScreener
    let logoUrl = null;
    try {
      const response = await fetch(`https://api.dexscreener.com/latest/dex/tokens/${ca}`, {
        headers: { 'User-Agent': 'Mozilla/5.0' }
      });
      const data = await response.json();
      if (data.pairs && data.pairs.length > 0) {
        logoUrl = data.pairs[0].info?.imageUrl;
      }
    } catch (e) {
      console.error("Failed to fetch DexScreener API:", e);
    }

    const templateUrl = new URL('/images/photo_2026-04-23_21-55-06.jpg', request.url).href;

    const children = [];
    
    // Background Image
    children.push(
      React.createElement('img', {
        src: templateUrl,
        style: {
          position: 'absolute',
          top: 0,
          left: 0,
          width: '1024px',
          height: '576px',
        }
      })
    );
    
    // Logo Overlay
    if (logoUrl) {
      children.push(
        React.createElement('img', {
          src: logoUrl,
          style: {
            position: 'absolute',
            left: '596px',
            top: '92px',
            width: '364px',
            height: '364px',
            borderRadius: '50%',
            objectFit: 'cover',
          }
        })
      );
    }

    const element = React.createElement('div', {
      style: {
        display: 'flex',
        width: '100%',
        height: '100%',
        position: 'relative',
      }
    }, children);

    return new ImageResponse(element, {
      width: 1024,
      height: 576,
    });
  } catch (e) {
    console.error(e);
    return new Response(`Failed to generate the image`, {
      status: 500,
    });
  }
}
