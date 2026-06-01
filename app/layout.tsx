import type { Metadata, Viewport } from "next";
import Script from "next/script";
import "./globals.css";
import { Providers } from "./providers";
import { SITE_CONFIG } from "@/constants";

export const metadata: Metadata = {
  title: {
    default: "Femoj World - Global Virtual Phone Number Marketplace",
    template: `%s | Femoj World`,
  },
  description: "Buy, sell, and manage virtual phone numbers globally. Get instant SMS verification, voice capabilities, and temporary or permanent virtual numbers for your business with Femoj World.",
  keywords: [
    "virtual phone numbers",
    "SMS verification",
    "virtual number marketplace",
    "temporary phone numbers",
    "permanent phone numbers",
    "global phone numbers",
    "SMS inbox",
    "voice calls",
    "OTP verification",
    "bulk SMS",
    "virtual number API",
    "phone number rental",
    "international numbers",
    "business communication",
  ],
  authors: [{ name: "Femoj World" }],
  creator: "Femoj World",
  publisher: "Femoj World",
  robots: "index, follow",
  metadataBase: new URL("https://femoj.com"),
  alternates: {
    canonical: "https://femoj.com",
  },
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/favicon.ico" },
    ],
  },
  openGraph: {
    type: "website",
    url: "https://femoj.com",
    title: "Femoj World - Global Virtual Phone Number Marketplace",
    description: "Buy, sell, and manage virtual phone numbers globally. Get instant SMS verification and voice capabilities.",
    siteName: "Femoj World",
    images: [
      {
        url: "https://femoj.com/og-image.png",
        width: 1200,
        height: 630,
        alt: "Femoj World - Virtual Phone Number Marketplace",
        type: "image/png",
      },
      {
        url: "https://femoj.com/og-image-square.png",
        width: 800,
        height: 800,
        alt: "Femoj World",
        type: "image/png",
      },
    ],
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Femoj World - Global Virtual Phone Number Marketplace",
    description: "Buy, sell, and manage virtual phone numbers globally. Get instant SMS verification and voice capabilities.",
    images: ["https://femoj.com/og-image.png"],
    creator: "@FemojWorld",
    site: "@FemojWorld",
  },
  category: "Technology",
  formatDetection: {
    telephone: false,
    email: false,
    address: false,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  colorScheme: "light dark",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Femoj World",
    url: "https://femoj.com",
    logo: "https://femoj.com/logo.png",
    image: "https://femoj.com/og-image.png",
    description: "Global virtual phone number marketplace for SMS verification, voice calls, and business communication.",
    sameAs: [
      "https://www.facebook.com/FemojWorld/",
      "https://www.twitter.com/FemojWorld",
      "https://www.instagram.com/FemojWorld",
      "https://www.linkedin.com/company/femoj-world",
      "https://www.youtube.com/@FemojWorld",
    ],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "Customer Support",
      email: "support@femoj.com",
      telephone: "+1-800-FEMOJ-1",
      availableLanguage: ["en"],
      areaServed: "Worldwide",
    },
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Femoj World",
    url: "https://femoj.com",
    description: "Global virtual phone number marketplace",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: "https://femoj.com/search?q={search_term_string}",
      },
      "query-input": "required name=search_term_string",
    },
  };

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "Femoj World",
    image: "https://femoj.com/og-image.png",
    description: "Buy, sell, and manage virtual phone numbers globally for SMS verification, voice calls, and business communication.",
    url: "https://femoj.com",
    telephone: "+1-800-FEMOJ-1",
    priceRange: "$$$",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Global Service",
      addressCountry: "US",
    },
    areaServed: {
      "@type": "Country",
      name: "Worldwide",
    },
    sameAs: [
      "https://www.facebook.com/FemojWorld",
      "https://www.twitter.com/FemojWorld",
      "https://www.instagram.com/FemojWorld",
    ],
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.8",
      reviewCount: "1000",
      bestRating: "5",
      worstRating: "1",
    },
  };

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: "Virtual Phone Numbers",
    description: "Temporary and permanent virtual phone numbers for SMS verification, voice calls, and business communication.",
    offers: {
      "@type": "AggregateOffer",
      priceCurrency: "USD",
      lowPrice: "9.99",
      highPrice: "99.99",
      offerCount: "50+",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.8",
      reviewCount: "500",
    },
  };

  return (
    <html
      lang="en"
      className="h-full antialiased"
      suppressHydrationWarning
    >
      <head>
        {/* JSON-LD Structured Data */}
        <Script
          id="organization-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
          strategy="afterInteractive"
        />
        <Script
          id="website-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
          strategy="afterInteractive"
        />
        <Script
          id="service-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
          strategy="afterInteractive"
        />
        <Script
          id="product-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
          strategy="afterInteractive"
        />

        {/* Additional Meta Tags */}
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="ie=edge" />
        <meta name="theme-color" content="#1f2937" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Femoj World" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
        <meta name="msapplication-TileColor" content="#1f2937" />
        <meta name="msapplication-TileImage" content="/favicon.ico" />
        <meta name="application-name" content="Femoj World" />
        <meta name="referrer" content="strict-origin-when-cross-origin" />
        <meta name="google-site-verification" content="YOUR_GOOGLE_VERIFICATION_CODE_HERE" />

        {/* Preconnect to External Sources */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

        {/* DNS Prefetch */}
        <link rel="dns-prefetch" href="https://analytics.google.com" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://www.google-analytics.com" />

        {/* Alternate Language Links */}
        <link rel="alternate" hrefLang="en-US" href="https://femoj.com" />
        <link rel="alternate" hrefLang="x-default" href="https://femoj.com" />

        {/* Google Analytics 4 with Enhanced Tracking */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-YOUR_GA_ID"
          strategy="afterInteractive"
          async
        />
        <Script
          id="google-analytics-init"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-YOUR_GA_ID', {
                'page_path': window.location.pathname,
                'page_title': document.title,
                'anonymize_ip': false,
                'allow_google_signals': true,
                'allow_ad_personalization_signals': true,
                'send_page_view': true,
                'cookie_flags': 'SameSite=None;Secure'
              });
              
              // Track all navigation events
              window.addEventListener('popstate', function() {
                gtag('event', 'page_view', {
                  'page_path': window.location.pathname,
                  'page_title': document.title,
                  'page_referrer': document.referrer
                });
              });
              
              // Track user engagement
              gtag('event', 'engagement', {
                'session_id': new Date().getTime()
              });
              
              // Track scroll depth
              let scrolled = false;
              window.addEventListener('scroll', function() {
                if(!scrolled) {
                  gtag('event', 'scroll');
                  scrolled = true;
                }
              });
            `,
          }}
        />

        {/* Google Tag Manager */}
        <Script
          id="gtm-init"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','GTM-YOUR_GTM_ID');
            `,
          }}
        />

        {/* Facebook Pixel */}
        <Script
          id="facebook-pixel"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', 'YOUR_FACEBOOK_PIXEL_ID');
              fbq('track', 'PageView');
            `,
          }}
        />

        {/* Preload Critical Resources */}
        <link rel="preload" as="font" href="https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600;700&display=swap" crossOrigin="anonymous" />

        {/* Open Graph and Twitter Card images */}
        <meta property="og:image:type" content="image/png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta name="twitter:image:alt" content="Femoj World - Global Virtual Phone Number Marketplace" />
      </head>
      <body className="bg-background text-foreground antialiased">
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-YOUR_GTM_ID"
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
          ></iframe>
        </noscript>

        {/* Facebook Pixel (noscript) */}
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: 'none' }}
            src="https://www.facebook.com/tr?id=YOUR_FACEBOOK_PIXEL_ID&ev=PageView&noscript=1"
            alt=""
          />
        </noscript>

        <Providers>{children}</Providers>

        {/* Theme Script */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const theme = localStorage.getItem('theme');
                if (theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                  document.documentElement.classList.add('dark');
                } else {
                  document.documentElement.classList.remove('dark');
                }
              } catch (e) {}
            `,
          }}
        />
      </body>
    </html>
  );
}
