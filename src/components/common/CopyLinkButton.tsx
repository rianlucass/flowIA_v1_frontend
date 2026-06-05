'use client';

import { useState } from 'react';
import { Copy, Check } from 'lucide-react';

interface CopyLinkButtonProps {
  link: string;
  label?: string;
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function CopyLinkButton({
  link,
  label = 'Copiar link',
  variant = 'default',
  size = 'md',
  className = '',
}: CopyLinkButtonProps) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Falha ao copiar:', err);
    }
  }

  // ── Variant styles ──────────────────────────────────────────────────────────
  const variantStyles = {
    default: 'bg-primary text-white hover:bg-primary/90',
    outline: 'bg-transparent border border-primary text-primary hover:bg-primary/10',
    ghost: 'bg-transparent text-primary hover:bg-primary/10',
  };

  // ── Size styles ─────────────────────────────────────────────────────────────
  const sizeStyles = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-5 py-2.5 text-base',
  };

  const iconSize = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      disabled={copied}
      className={`
        inline-flex items-center gap-2 font-medium rounded-lg
        transition-all duration-200 ease-in-out
        disabled:opacity-80 disabled:cursor-not-allowed
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${className}
      `}
    >
      {copied ? (
        <>
          <Check className={iconSize[size]} />
          <span>Copiado!</span>
        </>
      ) : (
        <>
          <Copy className={iconSize[size]} />
          <span>{label}</span>
        </>
      )}
    </button>
  );
}
