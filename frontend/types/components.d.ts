declare module '@/components/icons' {
  import { ComponentType, SVGProps } from 'react';
  
  export interface IconProps extends SVGProps<SVGSVGElement> {
    name: string;
    size?: number | string;
    className?: string;
  }
  
  export const Icon: ComponentType<IconProps>;
  
  export const Icons: {
    [key: string]: ComponentType<SVGProps<SVGSVGElement>>;
    spinner: ComponentType<SVGProps<SVGSVGElement>>;
    mail: ComponentType<SVGProps<SVGSVGElement>>;
    phone: ComponentType<SVGProps<SVGSVGElement>>;
    'map-pin': ComponentType<SVGProps<SVGSVGElement>>;
    clock: ComponentType<SVGProps<SVGSVGElement>>;
    'message-square': ComponentType<SVGProps<SVGSVGElement>>;
    twitter: ComponentType<SVGProps<SVGSVGElement>>;
    github: ComponentType<SVGProps<SVGSVGElement>>;
    linkedin: ComponentType<SVGProps<SVGSVGElement>>;
  };
}
