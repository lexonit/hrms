'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

/**
 * Card Component
 * Reusable card container with consistent styling
 */
export const Card = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ children, className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('bg-card text-card-foreground rounded-xl border shadow-sm', className)}
      {...props}
    >
      {children}
    </div>
  )
);
Card.displayName = 'Card';

/**
 * Button Component
 * Polymorphic button with variant support
 */
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline' | 'destructive';
  size?: 'default' | 'sm' | 'lg' | 'icon';
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'default', children, ...props }, ref) => {
    const variants = {
      primary: 'bg-primary text-primary-foreground hover:bg-primary/90',
      secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
      ghost: 'hover:bg-accent hover:text-accent-foreground',
      outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
      destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
    };
    
    const sizes = {
      default: 'h-10 px-4 py-2',
      sm: 'h-8 px-3 text-xs',
      lg: 'h-12 px-8',
      icon: 'h-8 w-8',
    };

    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
          'disabled:pointer-events-none disabled:opacity-50',
          sizes[size],
          variants[variant],
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);
Button.displayName = 'Button';

/**
 * Badge Component
 * Small status indicator or label
 */
interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'secondary' | 'outline' | 'destructive' | 'success';
}

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ children, className, variant = 'default', ...props }, ref) => {
    const variants = {
      default: 'bg-primary text-primary-foreground',
      secondary: 'bg-secondary text-secondary-foreground',
      outline: 'text-foreground border border-border',
      destructive: 'bg-destructive text-destructive-foreground',
      success: 'bg-green-500 text-white',
    };

    return (
      <span
        ref={ref}
        className={cn(
          'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors',
          variants[variant],
          className
        )}
        {...props}
      >
        {children}
      </span>
    );
  }
);
Badge.displayName = 'Badge';

/**
 * Input Component
 * Styled text input field
 */
export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, type, ...props }, ref) => (
    <input
      type={type}
      ref={ref}
      className={cn(
        'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm',
        'ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium',
        'placeholder:text-muted-foreground',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
        'disabled:cursor-not-allowed disabled:opacity-50',
        className
      )}
      {...props}
    />
  )
);
Input.displayName = 'Input';

/**
 * Textarea Component
 * Multi-line text input
 */
export const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => (
  <textarea
    ref={ref}
    className={cn(
      'flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm',
      'ring-offset-background placeholder:text-muted-foreground',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
      'disabled:cursor-not-allowed disabled:opacity-50',
      className
    )}
    {...props}
  />
));
Textarea.displayName = 'Textarea';

/**
 * BackgroundBeams Component
 * Decorative animated background
 */
export const BackgroundBeams: React.FC = () => (
  <div className="absolute inset-0 z-0 opacity-20 pointer-events-none overflow-hidden">
    <div className="absolute inset-[-10%] bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.2),transparent_50%)] animate-pulse" />
    <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.05)_50%,transparent_75%)] bg-[length:250%_250%] animate-shimmer" />
  </div>
);

/**
 * HoverCard Component
 * Card with hover animation effect
 */
export const HoverCard = React.forwardRef<HTMLDivElement, React.ComponentProps<typeof motion.div>>(
  ({ children, className, ...props }, ref) => (
    <motion.div
      ref={ref}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      className={cn(
        'relative rounded-xl border p-4 bg-card hover:shadow-xl transition-all duration-300',
        className
      )}
      {...props}
    >
      {children}
    </motion.div>
  )
);
HoverCard.displayName = 'HoverCard';

/**
 * Avatar Component
 * Displays user image with fallback to initials
 */
interface AvatarProps {
  src?: string | null;
  alt: string;
  fallback: string;
  size?: number;
  className?: string;
}

export const Avatar: React.FC<AvatarProps> = ({ src, alt, fallback, size = 40, className }) => {
  const [error, setError] = useState(false);

  if (!src || error) {
    return (
      <div
        style={{ width: size, height: size }}
        className={cn(
          'rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold uppercase select-none border border-primary/20',
          className
        )}
      >
        {fallback.substring(0, 2)}
      </div>
    );
  }

  return (
    <div className={cn('relative rounded-full overflow-hidden', className)} style={{ width: size, height: size }}>
      <Image
        src={src}
        alt={alt}
        fill
        sizes={`${size}px`}
        className="object-cover"
        onError={() => setError(true)}
      />
    </div>
  );
};
