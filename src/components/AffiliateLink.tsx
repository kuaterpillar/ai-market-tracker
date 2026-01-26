'use client';

import { trackAffiliateClick } from '@/lib/affiliate';

interface AffiliateLinkProps {
  href: string;
  toolName: string;
  className?: string;
  children: React.ReactNode;
}

export default function AffiliateLink({ href, toolName, className, children }: AffiliateLinkProps) {
  const handleClick = () => {
    trackAffiliateClick(toolName, href);
  };

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={handleClick}
      className={className}
    >
      {children}
    </a>
  );
}
