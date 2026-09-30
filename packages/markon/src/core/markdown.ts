/**
 * @nofinite/markon - Markdown Serializer & Parser
 * Clean, lightweight bidirectional Markdown <-> HTML conversion
 * supporting headings, lists, tables, code blocks, math formulas, and details.
 */

export function htmlToMarkdown(html: string): string {
  if (!html) return '';

  const temp = document.createElement('div');
  temp.innerHTML = html.trim();

  function processNode(node: Node): string {
    if (node.nodeType === Node.TEXT_NODE) {
      return node.textContent || '';
    }

    if (node.nodeType !== Node.ELEMENT_NODE) {
      return '';
    }

    const el = node as HTMLElement;
    const tag = el.tagName.toLowerCase();

    // Check for custom math block
    if (
      el.hasAttribute('data-math-block') ||
      el.classList.contains('markon-math-block')
    ) {
      const eq = el.getAttribute('data-equation') || el.textContent || '';
      return `\n\n$$\n${eq.trim()}\n$$\n\n`;
    }

    // Check for custom video block
    if (
      el.hasAttribute('data-video-block') ||
      el.classList.contains('markon-video-block')
    ) {
      const src = el.getAttribute('data-src') || '';
      return `\n\n![video](${src})\n\n`;
    }

    // Check for details / accordion
    if (tag === 'details') {
      const summaryEl = el.querySelector('summary');
      const summaryText = summaryEl
        ? summaryEl.textContent || 'Details'
        : 'Details';
      const contentEl = el.querySelector('.markon-details-content') || el;
      let bodyText = '';
      contentEl.childNodes.forEach((child) => {
        if (child !== summaryEl) {
          bodyText += processNode(child);
        }
      });
      return `\n\n<details><summary>${summaryText.trim()}</summary>\n${bodyText.trim()}\n</details>\n\n`;
    }

    // Process children recursively
    let childrenText = '';
    el.childNodes.forEach((child) => {
      childrenText += processNode(child);
    });

    switch (tag) {
      case 'h1':
        return `\n\n# ${childrenText.trim()}\n\n`;
      case 'h2':
        return `\n\n## ${childrenText.trim()}\n\n`;
      case 'h3':
        return `\n\n### ${childrenText.trim()}\n\n`;
      case 'h4':
        return `\n\n#### ${childrenText.trim()}\n\n`;
      case 'h5':
        return `\n\n##### ${childrenText.trim()}\n\n`;
      case 'h6':
        return `\n\n###### ${childrenText.trim()}\n\n`;
      case 'p':
        return `\n\n${childrenText.trim()}\n\n`;
      case 'strong':
      case 'b':
        return `**${childrenText}**`;
      case 'em':
      case 'i':
        return `*${childrenText}*`;
      case 'u':
        return `<u>${childrenText}</u>`;
      case 's':
      case 'del':
      case 'strike':
        return `~~${childrenText}~~`;
      case 'code':
        if (el.parentElement?.tagName.toLowerCase() === 'pre') {
          return childrenText;
        }
        return `\`${childrenText}\``;
      case 'pre': {
        const codeEl = el.querySelector('code');
        const langMatch = codeEl?.className.match(/language-(\w+)/);
        const lang = langMatch ? langMatch[1] : '';
        const rawCode = codeEl ? codeEl.textContent : el.textContent;
        return `\n\n\`\`\`${lang}\n${(rawCode || '').trim()}\n\`\`\`\n\n`;
      }
      case 'blockquote':
        return `\n\n> ${childrenText.trim().replace(/\n/g, '\n> ')}\n\n`;
      case 'ul':
        return `\n\n${childrenText.trim()}\n\n`;
      case 'ol':
        return `\n\n${childrenText.trim()}\n\n`;
      case 'li': {
        if (
          el.classList.contains('task-item') ||
          el.hasAttribute('data-checked')
        ) {
          const isChecked =
            el.getAttribute('data-checked') === 'true' ||
            el.querySelector('input[type="checkbox"]:checked') !== null;
          return `- [${isChecked ? 'x' : ' '}] ${childrenText.trim()}\n`;
        }
        const parent = el.parentElement;
        if (parent && parent.tagName.toLowerCase() === 'ol') {
          const index = Array.from(parent.children).indexOf(el) + 1;
          return `${index}. ${childrenText.trim()}\n`;
        }
        return `- ${childrenText.trim()}\n`;
      }
      case 'hr':
        return `\n\n---\n\n`;
      case 'a': {
        const href = el.getAttribute('href') || '#';
        return `[${childrenText}](${href})`;
      }
      case 'img': {
        const src = el.getAttribute('src') || '';
        const alt = el.getAttribute('alt') || '';
        return `![${alt}](${src})`;
      }
      case 'table': {
        const rows = Array.from(el.querySelectorAll('tr'));
        if (rows.length === 0) return '';

        let tableMd = '\n\n';
        rows.forEach((row, rowIndex) => {
          const cells = Array.from(row.querySelectorAll('th, td'));
          const cellTexts = cells.map((c) =>
            (c.textContent || '').trim().replace(/\|/g, '\\|')
          );
          tableMd += `| ${cellTexts.join(' | ')} |\n`;

          if (rowIndex === 0) {
            const separator = cells.map(() => '---').join(' | ');
            tableMd += `| ${separator} |\n`;
          }
        });
        return `${tableMd}\n`;
      }
      case 'br':
        return '\n';
      default:
        return childrenText;
    }
  }

  const rawMd = processNode(temp);
  // Clean up excessive blank lines
  return rawMd.replace(/\n{3,}/g, '\n\n').trim();
}

export function markdownToHtml(md: string): string {
  if (!md) return '<p></p>';

  const lines = md.split('\n');
  const htmlParts: string[] = [];
  let inCodeBlock = false;
  let codeLang = '';
  let codeBuffer: string[] = [];
  let inTable = false;
  let tableBuffer: string[] = [];
  let inList: 'ul' | 'ol' | null = null;

  const flushList = () => {
    if (inList) {
      htmlParts.push(`</${inList}>`);
      inList = null;
    }
  };

  const flushTable = () => {
    if (inTable && tableBuffer.length > 0) {
      let tableHtml =
        '<table class="table border border-default w-full my-3 rounded-lg overflow-hidden text-sm"><tbody>';
      tableBuffer.forEach((row, idx) => {
        // Skip separator line (e.g. | --- | --- |)
        if (row.match(/^\|?\s*[-:]+[-|\s:]*\|?$/)) return;
        const cells = row
          .split('|')
          .map((c) => c.trim())
          .filter((c, i, arr) =>
            i === 0 && c === ''
              ? false
              : i === arr.length - 1 && c === ''
              ? false
              : true
          );

        const isHeader = idx === 0;
        tableHtml += '<tr>';
        cells.forEach((cell) => {
          if (isHeader) {
            tableHtml += `<th class="border border-default p-2 text-left bg-subtle font-semibold">${inlineFormatting(
              cell
            )}</th>`;
          } else {
            tableHtml += `<td class="border border-default p-2">${inlineFormatting(
              cell
            )}</td>`;
          }
        });
        tableHtml += '</tr>';
      });
      tableHtml += '</tbody></table>';
      htmlParts.push(tableHtml);
      tableBuffer = [];
      inTable = false;
    }
  };

  const inlineFormatting = (text: string): string => {
    return (
      text
        // Bold + Italic
        .replace(/\*\*\*(.*?)\*\*\*/g, '<strong><em>$1</em></strong>')
        // Bold
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        // Italic
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        // Strikethrough
        .replace(/~~(.*?)~~/g, '<s>$1</s>')
        // Underline <u>
        .replace(/<u>(.*?)<\/u>/g, '<u>$1</u>')
        // Inline code
        .replace(
          /`([^`]+)`/g,
          '<code class="bg-subtle px-1 py-0.5 rounded font-mono text-xs">$1</code>'
        )
        // Images
        .replace(
          /!\[(.*?)\]\((.*?)\)/g,
          '<img src="$2" alt="$1" class="rounded-xl border border-default shadow-sm max-w-full my-2" />'
        )
        // Links
        .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" class="link">$1</a>')
    );
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Code block toggle
    if (line.startsWith('```')) {
      if (inCodeBlock) {
        htmlParts.push(
          `<pre><code class="language-${
            codeLang || 'plaintext'
          }">${codeBuffer.join('\n')}</code></pre>`
        );
        codeBuffer = [];
        inCodeBlock = false;
        codeLang = '';
      } else {
        flushList();
        flushTable();
        inCodeBlock = true;
        codeLang = line.slice(3).trim();
      }
      continue;
    }

    if (inCodeBlock) {
      codeBuffer.push(line);
      continue;
    }

    // Tables
    if (line.trim().startsWith('|')) {
      flushList();
      inTable = true;
      tableBuffer.push(line.trim());
      continue;
    } else if (inTable) {
      flushTable();
    }

    // Horizontal rule
    if (
      line.trim() === '---' ||
      line.trim() === '***' ||
      line.trim() === '___'
    ) {
      flushList();
      htmlParts.push('<hr />');
      continue;
    }

    // Math block ($$ ... $$)
    if (line.trim() === '$$') {
      flushList();
      let eqBuffer = '';
      i++;
      while (i < lines.length && lines[i].trim() !== '$$') {
        eqBuffer += lines[i] + '\n';
        i++;
      }
      htmlParts.push(
        `<div data-math-block="" data-equation="${eqBuffer.trim()}" class="markon-math-block my-3 p-3 rounded-lg border border-default bg-subtle/50 text-center">${eqBuffer.trim()}</div>`
      );
      continue;
    }

    // Details / accordion
    if (line.trim().startsWith('<details>')) {
      flushList();
      let detailsBuffer = line + '\n';
      while (i + 1 < lines.length && !lines[i].includes('</details>')) {
        i++;
        detailsBuffer += lines[i] + '\n';
      }
      htmlParts.push(detailsBuffer.trim());
      continue;
    }

    // Headings
    if (line.startsWith('# ')) {
      flushList();
      htmlParts.push(`<h1>${inlineFormatting(line.slice(2).trim())}</h1>`);
      continue;
    }
    if (line.startsWith('## ')) {
      flushList();
      htmlParts.push(`<h2>${inlineFormatting(line.slice(3).trim())}</h2>`);
      continue;
    }
    if (line.startsWith('### ')) {
      flushList();
      htmlParts.push(`<h3>${inlineFormatting(line.slice(4).trim())}</h3>`);
      continue;
    }
    if (line.startsWith('#### ')) {
      flushList();
      htmlParts.push(`<h4>${inlineFormatting(line.slice(5).trim())}</h4>`);
      continue;
    }

    // Blockquote
    if (line.startsWith('> ')) {
      flushList();
      htmlParts.push(
        `<blockquote><p>${inlineFormatting(
          line.slice(2).trim()
        )}</p></blockquote>`
      );
      continue;
    }

    // Task List
    const taskMatch = line.match(/^[-*]\s+\[([ xX])\]\s+(.*)$/);
    if (taskMatch) {
      if (inList !== 'ul') {
        flushList();
        inList = 'ul';
        htmlParts.push('<ul class="task-list list-none p-0 my-2 space-y-1">');
      }
      const isChecked = taskMatch[1].toLowerCase() === 'x';
      htmlParts.push(
        `<li class="task-item flex items-center gap-2" data-checked="${isChecked}"><label><input type="checkbox" ${
          isChecked ? 'checked' : ''
        } disabled /></label><span>${inlineFormatting(
          taskMatch[2].trim()
        )}</span></li>`
      );
      continue;
    }

    // Unordered List
    if (line.match(/^[-*]\s+(.*)$/)) {
      const content = line.replace(/^[-*]\s+/, '');
      if (inList !== 'ul') {
        flushList();
        inList = 'ul';
        htmlParts.push('<ul>');
      }
      htmlParts.push(`<li>${inlineFormatting(content.trim())}</li>`);
      continue;
    }

    // Ordered List
    const olMatch = line.match(/^(\d+)\.\s+(.*)$/);
    if (olMatch) {
      if (inList !== 'ol') {
        flushList();
        inList = 'ol';
        htmlParts.push('<ol>');
      }
      htmlParts.push(`<li>${inlineFormatting(olMatch[2].trim())}</li>`);
      continue;
    }

    // Blank line
    if (!line.trim()) {
      flushList();
      continue;
    }

    // Regular paragraph
    flushList();
    htmlParts.push(`<p>${inlineFormatting(line.trim())}</p>`);
  }

  flushList();
  flushTable();

  return htmlParts.join('');
}
