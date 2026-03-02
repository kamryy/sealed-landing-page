export interface NavLink {
  label: string;
  href: string;
  isActive?: boolean;
}

export const NAV_LINKS: NavLink[] = [
  { label: 'Home', href: '#', isActive: true },
  { label: 'Features', href: '#' },
  { label: 'Benefits', href: '#' },
  { label: 'How it works', href: '#' },
  { label: 'FAQ', href: '#' },
  { label: 'Contact', href: '#' },
];
