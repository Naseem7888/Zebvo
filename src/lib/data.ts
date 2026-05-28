import type { LanguageCode, Platform, SocialPost } from '@/lib/types';

const now = Date.now();

function hoursAgo(hours: number): string {
  return new Date(now - hours * 60 * 60 * 1000).toISOString();
}

function buildPost(input: {
  platform: Platform;
  creator: string;
  handle: string;
  region: string;
  country: string;
  language: LanguageCode;
  hoursAgo: number;
  content: string;
  likes: number;
  comments: number;
  shares: number;
  views: number;
  clusterHint: string;
}): SocialPost {
  return {
    id: `${input.platform}-${input.handle}-${input.hoursAgo}-${input.clusterHint}`.toLowerCase().replace(/[^a-z0-9-]+/g, '-'),
    platform: input.platform,
    creator: input.creator,
    handle: input.handle,
    region: input.region,
    country: input.country,
    language: input.language,
    publishedAt: hoursAgo(input.hoursAgo),
    content: input.content,
    engagement: {
      likes: input.likes,
      comments: input.comments,
      shares: input.shares,
      views: input.views
    },
    sourceUrl: `https://${input.platform}.example.com/${input.handle}/${input.hoursAgo}`,
    clusterHint: input.clusterHint
  };
}

export function getSeedPosts(): SocialPost[] {
  return [
    buildPost({
      platform: 'reddit',
      creator: 'Harpreet Kaur',
      handle: 'u/harpreet_tech',
      region: 'Punjab, India',
      country: 'India',
      language: 'en',
      hoursAgo: 2,
      content:
        'Applied for a fresh passport through Passport Seva this morning. Appointment slots opened fast and the document checklist was clear.',
      likes: 210,
      comments: 34,
      shares: 12,
      views: 1840,
      clusterHint: 'fresh-application-slot'
    }),
    buildPost({
      platform: 'x',
      creator: 'Aman Verma',
      handle: '@amanwrites',
      region: 'Delhi, India',
      country: 'India',
      language: 'hi',
      hoursAgo: 1,
      content:
        'Passport application update: online form submitted, police verification completed, and the new booklet is expected next week.',
      likes: 98,
      comments: 15,
      shares: 18,
      views: 6200,
      clusterHint: 'fresh-application-slot'
    }),
    buildPost({
      platform: 'linkedin',
      creator: 'Ritika Sharma',
      handle: 'ritika-sharma',
      region: 'Chandigarh, India',
      country: 'India',
      language: 'en',
      hoursAgo: 4,
      content:
        'The renewal queue was surprisingly smooth today. Senior citizens received priority and the service team explained the status timeline clearly.',
      likes: 145,
      comments: 27,
      shares: 8,
      views: 3021,
      clusterHint: 'renewal-experience'
    }),
    buildPost({
      platform: 'facebook',
      creator: 'Passport Help Group',
      handle: 'passporthelpgroup',
      region: 'Punjab, India',
      country: 'India',
      language: 'en',
      hoursAgo: 3,
      content:
        'Tatkal passport appointments are back in demand. If you need urgent travel, keep documents ready and refresh the slot page often.',
      likes: 386,
      comments: 74,
      shares: 61,
      views: 12700,
      clusterHint: 'tatkal-demand'
    }),
    buildPost({
      platform: 'youtube',
      creator: 'Travel Desk India',
      handle: '@traveldeskindia',
      region: 'Mumbai, India',
      country: 'India',
      language: 'en',
      hoursAgo: 6,
      content:
        'Video guide: how to renew a passport without agent fees, what documents to upload, and how to track the file on the portal.',
      likes: 420,
      comments: 91,
      shares: 40,
      views: 15040,
      clusterHint: 'renewal-experience'
    }),
    buildPost({
      platform: 'instagram',
      creator: 'Nomad Notes',
      handle: '@nomadnotes',
      region: 'Dubai, UAE',
      country: 'UAE',
      language: 'en',
      hoursAgo: 5,
      content:
        'My passport renewal in the UAE was quick, but the airline counter asked for the visa page twice. Double-check travel rules before flying.',
      likes: 244,
      comments: 19,
      shares: 14,
      views: 9200,
      clusterHint: 'travel-check'
    }),
    buildPost({
      platform: 'reddit',
      creator: 'Singh Abroad',
      handle: 'u/singhabroad',
      region: 'Toronto, Canada',
      country: 'Canada',
      language: 'en',
      hoursAgo: 7,
      content:
        'Need a passport appointment for urgent visa travel. The center is asking for extra proof of flight bookings and address documents.',
      likes: 176,
      comments: 22,
      shares: 10,
      views: 5660,
      clusterHint: 'visa-travel-issue'
    }),
    buildPost({
      platform: 'threads',
      creator: 'Ministry Pulse',
      handle: '@ministrypulse',
      region: 'New Delhi, India',
      country: 'India',
      language: 'en',
      hoursAgo: 1,
      content:
        'Government announcement: more passport service counters are being added this week to reduce appointment delays across high-volume cities.',
      likes: 890,
      comments: 146,
      shares: 233,
      views: 26400,
      clusterHint: 'official-update'
    }),
    buildPost({
      platform: 'x',
      creator: 'News24 Punjab',
      handle: '@news24punjab',
      region: 'Punjab, India',
      country: 'India',
      language: 'pa',
      hoursAgo: 2,
      content:
        'Passport office update: students reporting faster processing after new counters opened in Jalandhar and Ludhiana.',
      likes: 501,
      comments: 89,
      shares: 88,
      views: 17350,
      clusterHint: 'official-update'
    }),
    buildPost({
      platform: 'facebook',
      creator: 'Secure India Watch',
      handle: 'secureindiawatch',
      region: 'Bengaluru, India',
      country: 'India',
      language: 'en',
      hoursAgo: 4,
      content:
        'Warning: fake passport agents are posting phishing links and asking for OTPs. Never share private data outside the official portal.',
      likes: 673,
      comments: 211,
      shares: 140,
      views: 29800,
      clusterHint: 'scam-alert'
    }),
    buildPost({
      platform: 'youtube',
      creator: 'Citizen Report',
      handle: '@citizenreport',
      region: 'Kolkata, India',
      country: 'India',
      language: 'en',
      hoursAgo: 9,
      content:
        'A family describes how they caught a passport scam after an unknown middleman demanded cash for a guaranteed appointment.',
      likes: 355,
      comments: 62,
      shares: 41,
      views: 11890,
      clusterHint: 'scam-alert'
    }),
    buildPost({
      platform: 'instagram',
      creator: 'Mandeep Boparai',
      handle: '@mandeepboparai',
      region: 'Amritsar, India',
      country: 'India',
      language: 'pa',
      hoursAgo: 8,
      content:
        'ਪਾਸਪੋਰਟ ਰੀਨਿਊਅਲ ਲਈ ਅੱਜ ਆਫਿਸ ਗਿਆ ਸੀ। ਸਾਰੀ ਪ੍ਰਕਿਰਿਆ ਸਾਫ਼ ਸੀ ਪਰ ਫੋਟੋ ਸਾਈਜ਼ ਦੀ ਇੱਕ ਵਾਰੀ ਫਿਰ ਜਾਂਚ ਕਰਨੀ ਪਈ।',
      likes: 132,
      comments: 17,
      shares: 6,
      views: 4040,
      clusterHint: 'renewal-experience'
    }),
    buildPost({
      platform: 'tiktok',
      creator: 'Passport Tips',
      handle: '@passporttips',
      region: 'London, UK',
      country: 'United Kingdom',
      language: 'en',
      hoursAgo: 10,
      content:
        'Checklist video for first-time passport applicants: photos, proof of address, appointment time, and a calm last-minute folder review.',
      likes: 1570,
      comments: 212,
      shares: 164,
      views: 52100,
      clusterHint: 'checklist-guide'
    }),
    buildPost({
      platform: 'reddit',
      creator: 'Traveling Parent',
      handle: 'u/travelingparent',
      region: 'Sydney, Australia',
      country: 'Australia',
      language: 'en',
      hoursAgo: 11,
      content:
        'After the renewal, my kid’s passport came with a clean photo page and the online tracking message was accurate. Useful for future family travel.',
      likes: 98,
      comments: 11,
      shares: 4,
      views: 2990,
      clusterHint: 'personal-story'
    }),
    buildPost({
      platform: 'linkedin',
      creator: 'Aman Legal',
      handle: 'aman-legal',
      region: 'New York, USA',
      country: 'United States',
      language: 'en',
      hoursAgo: 3,
      content:
        'Personal experience: the consular team explained passport amendment steps and kept the queue moving efficiently despite a heavy crowd.',
      likes: 206,
      comments: 33,
      shares: 9,
      views: 6405,
      clusterHint: 'personal-story'
    }),
    buildPost({
      platform: 'x',
      creator: 'FastTrack News',
      handle: '@fasttracknews',
      region: 'Delhi, India',
      country: 'India',
      language: 'en',
      hoursAgo: 12,
      content:
        'Breaking: passport authorities say all pending appointment slots from the weekend will be pushed live in waves to stabilize traffic.',
      likes: 912,
      comments: 194,
      shares: 302,
      views: 33800,
      clusterHint: 'breaking-news'
    }),
    buildPost({
      platform: 'x',
      creator: 'Gibberish Bot',
      handle: '@bot_zz93',
      region: 'Unknown',
      country: 'Unknown',
      language: 'en',
      hoursAgo: 1,
      content: 'xqzz prspct 777 !!! free slot click fast now http://spam.invalid',
      likes: 2,
      comments: 0,
      shares: 0,
      views: 12,
      clusterHint: 'gibberish'
    }),
    buildPost({
      platform: 'facebook',
      creator: 'Travel Clinic',
      handle: 'travelclinic',
      region: 'Chennai, India',
      country: 'India',
      language: 'en',
      hoursAgo: 14,
      content:
        'If your passport is expiring soon, renew early before visa applications. Delays are common when travel plans are already booked.',
      likes: 188,
      comments: 24,
      shares: 17,
      views: 7040,
      clusterHint: 'travel-check'
    }),
    buildPost({
      platform: 'instagram',
      creator: 'Student Abroad',
      handle: '@studentabroad',
      region: 'Birmingham, UK',
      country: 'United Kingdom',
      language: 'en',
      hoursAgo: 15,
      content:
        'My passport appointment got delayed, but the email alert was useful and the updated slot opened later the same day.',
      likes: 140,
      comments: 16,
      shares: 11,
      views: 5100,
      clusterHint: 'appointment-delay'
    }),
    buildPost({
      platform: 'threads',
      creator: 'Consulate Desk',
      handle: '@consulatedesk',
      region: 'Dubai, UAE',
      country: 'UAE',
      language: 'en',
      hoursAgo: 13,
      content:
        'Official reminder: always upload the correct photo dimensions for passport renewals or your file may be rejected without processing.',
      likes: 520,
      comments: 77,
      shares: 88,
      views: 21220,
      clusterHint: 'official-update'
    }),
    buildPost({
      platform: 'reddit',
      creator: 'Hindi Newswire',
      handle: 'u/hindinewswire',
      region: 'Lucknow, India',
      country: 'India',
      language: 'hi',
      hoursAgo: 9,
      content:
        'नई पासपोर्ट सेवा पर जानकारी: नागरिकों को डिजिटल स्लॉट और दस्तावेज़ सत्यापन की बेहतर सुविधा मिल रही है।',
      likes: 219,
      comments: 28,
      shares: 9,
      views: 7800,
      clusterHint: 'official-update'
    }),
    buildPost({
      platform: 'youtube',
      creator: 'Travel Scam Alert',
      handle: '@travelscamalert',
      region: 'Singapore',
      country: 'Singapore',
      language: 'en',
      hoursAgo: 16,
      content:
        'Scam warning video: fake passport verification messages are circulating via SMS, with links that steal credentials and payment data.',
      likes: 308,
      comments: 49,
      shares: 68,
      views: 15800,
      clusterHint: 'scam-alert'
    }),
    buildPost({
      platform: 'tiktok',
      creator: 'Quick Visa Tips',
      handle: '@quickvisatips',
      region: 'Jakarta, Indonesia',
      country: 'Indonesia',
      language: 'en',
      hoursAgo: 17,
      content:
        'Passport photo tip: avoid glare, keep the background plain, and check the document checklist before you leave home.',
      likes: 804,
      comments: 93,
      shares: 102,
      views: 29800,
      clusterHint: 'checklist-guide'
    }),
    buildPost({
      platform: 'linkedin',
      creator: 'Citizen Services Desk',
      handle: 'citizen-services',
      region: 'Jaipur, India',
      country: 'India',
      language: 'en',
      hoursAgo: 18,
      content:
        'Renewal applicants are reporting fewer delays when they schedule early morning slots and keep supporting documents scanned in advance.',
      likes: 179,
      comments: 21,
      shares: 13,
      views: 4800,
      clusterHint: 'renewal-experience'
    }),
    buildPost({
      platform: 'instagram',
      creator: 'Holiday Family',
      handle: '@holidayfamily',
      region: 'Doha, Qatar',
      country: 'Qatar',
      language: 'en',
      hoursAgo: 19,
      content:
        'We got our passport back in time for the holiday, and the status tracker matched the office update perfectly.',
      likes: 90,
      comments: 6,
      shares: 4,
      views: 2500,
      clusterHint: 'personal-story'
    }),
    buildPost({
      platform: 'threads',
      creator: 'Global Desk',
      handle: '@globaldesk',
      region: 'Paris, France',
      country: 'France',
      language: 'fr',
      hoursAgo: 20,
      content:
        'Conseil de voyage: renouvelez votre passeport avant de réserver un visa ou un billet non remboursable.',
      likes: 260,
      comments: 32,
      shares: 27,
      views: 6500,
      clusterHint: 'travel-check'
    })
  ];
}
