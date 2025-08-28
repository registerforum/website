'use client';
import React from 'react';
import Image from 'next/image';
import styles from '@/styles/Article.module.css';

export function ArticleBody({ content }) {
  if (!content) return null;

  const paragraphs = content.split('\n');

  return (
    <article className={styles.body}>
      {paragraphs.map((paragraph, index) => {
        // Check if paragraph contains an image URL
        const imageUrlMatch = paragraph.match(/https?:\/\/[^\s]+\.(jpg|jpeg|png|gif|webp|svg)/i);
        
        if (imageUrlMatch) {
          const imageUrl = imageUrlMatch[0];
          const altText = paragraph.replace(imageUrl, '').trim() || 'Article image';
          
          return (
            <div key={index} className={styles.imageContainer}>
              <Image
                src={imageUrl}
                alt={altText}
                width={600}
                height={400}
                style={{
                  width: '100%',
                  height: 'auto',
                  objectFit: 'cover'
                }}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 600px"
                loading="lazy"
              />
              {altText && altText !== imageUrl && (
                <p className={styles.imageCaption}>{altText}</p>
              )}
            </div>
          );
        }
        
        // Regular paragraph
        return (
          <p key={index} className={styles.par}>
            {paragraph}
          </p>
        );
      })}
    </article>
  );
}
