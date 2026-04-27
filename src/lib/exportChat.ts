import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } from 'docx';
import { saveAs } from 'file-saver';
import type { Message } from '@/store/chatStore';

export async function exportChatToDocx(messages: Message[], title = 'AI Station Conversation') {
  const children: Paragraph[] = [
    new Paragraph({
      alignment: AlignmentType.CENTER,
      heading: HeadingLevel.HEADING_1,
      children: [new TextRun({ text: '🚉 ' + title, bold: true, size: 36 })],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [new TextRun({ text: `Exported ${new Date().toLocaleString()}`, italics: true, color: '888888', size: 18 })],
    }),
    new Paragraph({ children: [new TextRun('')] }),
  ];

  for (const m of messages) {
    const who = m.role === 'user' ? 'YOU' : (m.modelLabel || 'ASSISTANT').toUpperCase();
    children.push(new Paragraph({
      heading: HeadingLevel.HEADING_3,
      children: [new TextRun({ text: who, bold: true, color: m.role === 'user' ? '7C3AED' : '06B6D4' })],
    }));
    if (m.isImage && m.imageUrl) {
      children.push(new Paragraph({ children: [new TextRun({ text: `[Image] ${m.imageUrl}`, italics: true })] }));
    } else {
      const lines = (m.content || '').split('\n');
      for (const line of lines) {
        children.push(new Paragraph({ children: [new TextRun(line)] }));
      }
    }
    children.push(new Paragraph({ children: [new TextRun('')] }));
  }

  const doc = new Document({ sections: [{ children }] });
  const blob = await Packer.toBlob(doc);
  saveAs(blob, `${title.replace(/[^a-z0-9]+/gi, '_').slice(0, 40) || 'chat'}.docx`);
}