import PDFDocument from 'pdfkit';
import type { ProcessedPost } from '@/lib/types';

function escapeCsv(value: string): string {
  return `"${value.replace(/"/g, '""')}"`;
}

export function buildCsv(posts: ProcessedPost[]): string {
  const header = [
    'id',
    'platform',
    'creator',
    'handle',
    'region',
    'country',
    'language',
    'publishedAt',
    'category',
    'sentiment',
    'summary',
    'content',
    'likes',
    'comments',
    'shares',
    'views',
    'clusterId'
  ].join(',');

  const rows = posts.map((post) =>
    [
      post.id,
      post.platform,
      post.creator,
      post.handle,
      post.region,
      post.country,
      post.language,
      post.publishedAt,
      post.category,
      post.sentiment,
      post.summary,
      post.content,
      String(post.engagement.likes),
      String(post.engagement.comments),
      String(post.engagement.shares),
      String(post.engagement.views),
      post.clusterId
    ]
      .map((value) => escapeCsv(value))
      .join(',')
  );

  return [header, ...rows].join('\n');
}

export async function buildPdf(posts: ProcessedPost[]): Promise<Buffer> {
  return await new Promise<Buffer>((resolve, reject) => {
    const doc = new PDFDocument({ margin: 36, size: 'A4', bufferPages: true });
    const chunks: Buffer[] = [];

    doc.on('data', (chunk: Buffer) => chunks.push(chunk));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);

    doc.fontSize(18).fillColor('#11233d').text('Zebvo Passport Social Dashboard', { align: 'center' });
    doc.moveDown(0.4);
    doc.fontSize(10).fillColor('#52627d').text(`Filtered post export generated ${new Date().toLocaleString()}`, { align: 'center' });
    doc.moveDown(1);

    posts.forEach((post, index) => {
      if (index > 0) doc.addPage();

      doc.roundedRect(36, 36, 523, 770, 12).strokeColor('#d7dfeb').stroke();
      doc.moveDown(1.6);
      doc.fontSize(14).fillColor('#11233d').text(`${post.platform.toUpperCase()} • ${post.creator}`, 54, 56);
      doc.fontSize(10).fillColor('#52627d').text(`${post.handle} • ${post.region} • ${post.category}`, 54, 76);
      doc.moveDown(0.5);
      doc.fontSize(11).fillColor('#24344d').text(`Summary: ${post.summary}`, { width: 490, align: 'left' });
      doc.moveDown(0.4);
      doc.text(`Original: ${post.content}`, { width: 490 });
      doc.moveDown(0.4);
      doc.text(`Sentiment: ${post.sentiment} • Language: ${post.language} • Published: ${new Date(post.publishedAt).toLocaleString()}`);
      doc.moveDown(0.4);
      doc.text(`Engagement: ${post.engagement.likes} likes, ${post.engagement.comments} comments, ${post.engagement.shares} shares, ${post.engagement.views} views`);
      doc.moveDown(0.4);
      doc.text(`Cluster: ${post.clusterId}`);
    });

    doc.end();
  });
}
