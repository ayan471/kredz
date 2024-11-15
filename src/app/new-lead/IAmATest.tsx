'use client'

import { useEffect } from 'react';

const InvolveMeEmbed = () => {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://himanshu-kashyap.involve.me/embed';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div className="involveme_embed" data-project="new-project-1f03"></div>
  );
};

export default InvolveMeEmbed;
