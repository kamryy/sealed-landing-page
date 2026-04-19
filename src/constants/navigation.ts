export interface NavLink {
  label: string;
  href: string;
  isActive?: boolean;
}

export const NAV_LINKS: NavLink[] = [
  { label: 'Home', href: '/', isActive: true },
  { label: 'Features', href: '#features' },
  { label: 'Benefits', href: '#benefits' },
  { label: 'How it works', href: '#how-it-works' },
  { label: 'FAQ', href: '#faq' },
  { label: 'Contact', href: '/contact' },
];
