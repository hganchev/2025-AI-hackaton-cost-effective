import React from 'react';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      [elemName: string]: any;
    }
  }
}

declare module 'react' {
  interface ReactNode {
    children?: ReactNode | ReactNode[];
  }
}

declare module 'next-themes' {
  export interface ThemeProviderProps {
    attribute?: string;
    defaultTheme?: string;
    enableSystem?: boolean;
    disableTransitionOnChange?: boolean;
    children?: React.ReactNode;
    [key: string]: any;
  }
  
  export function useTheme(): {
    theme: string | undefined;
    setTheme: (theme: string) => void;
    themes: string[];
  };
  
  export const ThemeProvider: React.FC<ThemeProviderProps>;
}

declare module 'next/link' {
  import { LinkProps as NextLinkProps } from 'next/dist/client/link';
  import React from 'react';
  
  type LinkProps = NextLinkProps & {
    children?: React.ReactNode;
    className?: string;
    [key: string]: any;
  };
  
  const Link: React.FC<LinkProps>;
  export default Link;
}

declare module 'next/image' {
  import React from 'react';
  
  interface ImageProps {
    src: string;
    alt: string;
    width?: number;
    height?: number;
    fill?: boolean;
    className?: string;
    [key: string]: any;
  }
  
  const Image: React.FC<ImageProps>;
  export default Image;
}

declare module 'next/navigation' {
  export function usePathname(): string;
  export function useRouter(): {
    push: (url: string) => void;
    replace: (url: string) => void;
    back: () => void;
  };
}

declare module 'next' {
  export interface Metadata {
    title?: string;
    description?: string;
    [key: string]: any;
  }
}

declare module 'next/font/google' {
  export interface FontOptions {
    subsets?: string[];
    weight?: string | string[];
    style?: string | string[];
    display?: string;
  }

  export function Inter(options: FontOptions): {
    className: string;
    style: React.CSSProperties;
  };
}

declare module 'lucide-react' {
  import React from 'react';
  
  interface IconProps {
    size?: number | string;
    color?: string;
    className?: string;
    [key: string]: any;
  }
  
  export const Search: React.FC<IconProps>;
  export const Menu: React.FC<IconProps>;
  export const Sun: React.FC<IconProps>;
  export const Moon: React.FC<IconProps>;
  export const ChevronLeft: React.FC<IconProps>;
  export const ChevronRight: React.FC<IconProps>;
  export const BookOpen: React.FC<IconProps>;
  export const Bookmark: React.FC<IconProps>;
  export const Share2: React.FC<IconProps>;
  export const Settings: React.FC<IconProps>;
  export const Filter: React.FC<IconProps>;
  export const Grid: React.FC<IconProps>;
  export const List: React.FC<IconProps>;
} 