import React from 'react';
import { Link } from 'react-router-dom';
import { Navigation, Twitter, Instagram, Facebook, Youtube, Send } from 'lucide-react';

const Footer = () => {
  const footerColumns = [
    {
      title: 'About',
      links: [
        { label: 'About Us', href: '/about' },
        { label: 'How It Works', href: '/how-it-works' },
        { label: 'Careers', href: '/careers' },
        { label: 'Contact Us', href: '/contact' },
      ],
    },
    {
      title: 'Explore',
      links: [
        { label: 'Hotels', href: '/hotels' },
        { label: 'Tour Guides', href: '/tour-guides' },
        { label: 'Vehicle', href: '/transport' },
        { label: 'Destinations', href: '/destinations' },
      ],
    },
    {
      title: 'Policy',
      links: [
        { label: 'General Terms & Conditions', href: '/terms' },
        { label: 'Privacy Policy', href: '/privacy' },
        { label: 'Cookie Policy', href: '/cookies' },
        { label: 'Refund Policy', href: '/refunds' },
      ],
    },
    {
      title: 'My Account',
      links: [
        { label: 'Sign In', href: '/login' },
        { label: 'Register', href: '/register' },
        { label: 'My Bookings', href: '/bookings' },
        { label: 'Support', href: '/support' },
      ],
    },
  ];

  const socialLinks = [
    { icon: <Twitter size={18} />, href: 'https://twitter.com', label: 'Twitter' },
    { icon: <Instagram size={18} />, href: 'https://instagram.com', label: 'Instagram' },
    { icon: <Facebook size={18} />, href: 'https://facebook.com', label: 'Facebook' },
    { icon: <Youtube size={18} />, href: 'https://youtube.com', label: 'YouTube' },
    { icon: <Send size={18} />, href: 'https://t.me', label: 'Telegram' },
  ];

  return (
    <footer
      style={{
        backgroundColor: '#1a1a2e',
        borderTop: '1px solid rgba(255,255,255,0.08)',
        fontFamily: "'Sora', 'Segoe UI', sans-serif",
      }}
    >


      {/* Top Bar: Logo + Divider + Socials */}
      <div
        style={{
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '40px 32px 28px',
          display: 'flex',
          alignItems: 'center',
          gap: '24px',
          flexWrap: 'wrap',
        }}
      >
        {/* Logo */}
        <Link
          to="/"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            textDecoration: 'none',
            flexShrink: 0,
          }}
        >
          <div
            style={{
              width: '44px',
              height: '44px',
              background: 'linear-gradient(135deg, #f59e0b, #f97316)',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 15px rgba(249,115,22,0.4)',
            }}
          >
            <Navigation size={22} color="white" />
          </div>
          <span
            style={{
              color: 'white',
              fontWeight: 800,
              fontSize: '22px',
              letterSpacing: '-0.5px',
            }}
          >
            Pearl<span style={{ color: '#f59e0b' }}>Path</span>
          </span>
        </Link>

        {/* Divider */}
        <div
          style={{
            flex: 1,
            height: '1px',
            backgroundColor: 'rgba(255,255,255,0.15)',
            minWidth: '40px',
          }}
        />

        {/* Social Icons */}
        <div style={{ display: 'flex', gap: '10px', flexShrink: 0 }}>
          {socialLinks.map((social) => (
            <a
              key={social.label}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={social.label}
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #f97316, #f59e0b)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                textDecoration: 'none',
                transition: 'transform 0.2s, box-shadow 0.2s',
                boxShadow: '0 2px 8px rgba(249,115,22,0.3)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-3px)';
                e.currentTarget.style.boxShadow = '0 6px 16px rgba(249,115,22,0.5)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(249,115,22,0.3)';
              }}
            >
              {social.icon}
            </a>
          ))}
        </div>
      </div>

      {/* Columns */}
      <div
        style={{
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '8px 32px 40px',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
          gap: '32px',
        }}
      >
        {footerColumns.map((col) => (
          <div key={col.title}>
            <h3
              style={{
                color: 'white',
                fontWeight: 800,
                fontSize: '13px',
                letterSpacing: '1.5px',
                textTransform: 'uppercase',
                marginBottom: '16px',
              }}
            >
              {col.title}
            </h3>
            <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {col.links.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.href}
                    style={{
                      color: 'rgba(255,255,255,0.6)',
                      textDecoration: 'none',
                      fontSize: '14px',
                      fontWeight: 400,
                      transition: 'color 0.2s',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = '#f59e0b')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.6)')}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Copyright */}
      <div
        style={{
          borderTop: '1px solid rgba(255,255,255,0.08)',
          padding: '20px 32px',
          textAlign: 'center',
        }}
      >
        <p
          style={{
            color: 'rgba(255,255,255,0.4)',
            fontSize: '13px',
            margin: 0,
          }}
        >
          @{new Date().getFullYear()} PearlPath Sri Lanka. All Rights Reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;