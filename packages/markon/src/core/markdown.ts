/**
 * @nofinite/markon - Markdown Serializer & Parser
 * Clean, lightweight bidirectional Markdown <-> HTML conversion
 * supporting headings, lists, tables, code blocks, math formulas, and details.
 */

export function htmlToMarkdown(html: string): string {
  if (!html) return '';

  if (typeof document === 'undefined') {
    return html
      .replace(/<h1>(.*?)<\/h1>/gi, '# $1\n\n')
      .replace(/<h2>(.*?)<\/h2>/gi, '## $1\n\n')
      .replace(/<h3>(.*?)<\/h3>/gi, '### $1\n\n')
      .replace(/<p>(.*?)<\/p>/gi, '$1\n\n')
      .replace(/<strong>(.*?)<\/strong>/gi, '**$1**')
      .replace(/<em>(.*?)<\/em>/gi, '*$1*')
      .replace(/<u>(.*?)<\/u>/gi, '<u>$1</u>')
      .replace(/<s(?:trike)?>(.*?)<\/s(?:trike)?>/gi, '~~$1~~')
      .replace(/<del>(.*?)<\/del>/gi, '~~$1~~')
      .replace(/<mark[^>]*>(.*?)<\/mark>/gi, '==$1==')
      .replace(/<sub>(.*?)<\/sub>/gi, '~$1~')
      .replace(/<sup>(.*?)<\/sup>/gi, '^$1^')
      .replace(/<code>(.*?)<\/code>/gi, '`$1`')
      .replace(/<a[^>]*href="([^"]*)"[^>]*>(.*?)<\/a>/gi, '[$2]($1)')
      .replace(/<[^>]+>/g, '')
      .trim();
  }

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

    // Check for callout / alert block
    if (
      el.hasAttribute('data-callout') ||
      el.classList.contains('markon-callout') ||
      el.classList.contains('alert')
    ) {
      let calloutType = el.getAttribute('data-callout-type') || 'info';
      if (!el.getAttribute('data-callout-type')) {
        if (el.classList.contains('alert-success')) calloutType = 'success';
        else if (el.classList.contains('alert-warning'))
          calloutType = 'warning';
        else if (el.classList.contains('alert-danger')) calloutType = 'danger';
      }
      const alertTagMap: Record<string, string> = {
        info: 'NOTE',
        success: 'TIP',
        warning: 'WARNING',
        danger: 'CAUTION',
      };
      const alertTag = alertTagMap[calloutType] || 'NOTE';
      const contentEl = el.querySelector('.alert-content') || el;
      let bodyText = '';
      contentEl.childNodes.forEach((child) => {
        if (
          !child.contains ||
          !child.parentElement?.classList.contains('alert-icon')
        ) {
          bodyText += processNode(child);
        }
      });
      return `\n\n> [!${alertTag}]\n> ${bodyText
        .trim()
        .replace(/\n{3,}/g, '\n\n')
        .replace(/\n/g, '\n> ')}\n\n`;
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
      case 'mark':
        return `==${childrenText}==`;
      case 'sub':
        return `~${childrenText}~`;
      case 'sup':
        return `^${childrenText}^`;
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
          const cellTexts = cells.map((c) => {
            let cellContent = '';
            c.childNodes.forEach((child) => {
              cellContent += processNode(child);
            });
            return cellContent
              .trim()
              .replace(/\n+/g, ' ')
              .replace(/\|/g, '\\|');
          });
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
        // Subscript: single tildes not preceded or followed by ~
        .replace(/(?<!~)~([^~\s][^~]*?)~(?!~)/g, '<sub>$1</sub>')
        // Superscript: ^text^
        .replace(/\^([^^]+)\^/g, '<sup>$1</sup>')
        // Highlight: ==text==
        .replace(/==([^=]+)==/g, '<mark>$1</mark>')
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

    // Single-line Math block ($$ ... $$)
    const singleLineMath = line.trim().match(/^\$\$(.+)\$\$$/);
    if (singleLineMath) {
      flushList();
      const eq = singleLineMath[1].trim();
      htmlParts.push(
        `<div data-math-block="" data-equation="${eq}" class="markon-math-block my-3 p-3 rounded-lg border border-default bg-subtle/50 text-center">${eq}</div>`
      );
      continue;
    }

    // Multi-line Math block ($$ ... $$)
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
      const rawDetails = detailsBuffer.trim();
      if (
        !rawDetails.includes('data-details-content') &&
        !rawDetails.includes('markon-details-content')
      ) {
        const summaryMatch = rawDetails.match(
          /<summary>([\s\S]*?)<\/summary>([\s\S]*?)<\/details>/i
        );
        if (summaryMatch) {
          const summaryHtml = summaryMatch[1].trim();
          const bodyHtml = summaryMatch[2].trim();
          const wrapped = `<details><summary class="markon-summary font-semibold text-sm cursor-pointer select-none text-default hover:text-primary list-none flex items-center gap-2 py-1">${summaryHtml}</summary><div data-details-content="" class="markon-details-content pt-2 pl-4 border-l-2 border-primary/40 mt-1 space-y-2">${
            bodyHtml.startsWith('<')
              ? bodyHtml
              : `<p>${inlineFormatting(bodyHtml)}</p>`
          }</div></details>`;
          htmlParts.push(wrapped);
          continue;
        }
      }
      htmlParts.push(rawDetails);
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

    // Alert / Callout (> [!NOTE], > [!TIP], > [!WARNING], > [!CAUTION], > [!IMPORTANT])
    const alertMatch = line.match(
      /^>\s*\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\]/i
    );
    if (alertMatch) {
      flushList();
      const rawTag = alertMatch[1].toUpperCase();
      let alertType = 'info';
      if (rawTag === 'TIP') alertType = 'success';
      else if (rawTag === 'WARNING') alertType = 'warning';
      else if (rawTag === 'CAUTION') alertType = 'danger';
      else if (rawTag === 'IMPORTANT') alertType = 'info';

      const alertLines: string[] = [];
      i++;
      while (i < lines.length && lines[i].trim().startsWith('>')) {
        alertLines.push(lines[i].replace(/^>\s?/, ''));
        i++;
      }
      i--; // rewind one since loop will increment

      const innerContent = alertLines.join('\n').trim();
      let innerHtml = '';
      if (innerContent) {
        const paragraphs = innerContent.split(/\n\s*\n/);
        innerHtml = paragraphs
          .map((p) => `<p>${inlineFormatting(p.trim())}</p>`)
          .join('');
      } else {
        innerHtml = '<p></p>';
      }

      htmlParts.push(
        `<div data-callout="" data-callout-type="${alertType}" class="markon-callout alert alert-${alertType} my-3 relative rounded-xl border"><div class="alert-content flex-1 min-w-0">${innerHtml}</div></div>`
      );
      continue;
    }

    // Blockquote
    if (line.startsWith('>')) {
      flushList();
      const quoteLines: string[] = [];
      while (i < lines.length && lines[i].trim().startsWith('>')) {
        quoteLines.push(lines[i].replace(/^>\s?/, ''));
        i++;
      }
      i--;
      htmlParts.push(
        `<blockquote><p>${inlineFormatting(
          quoteLines.join(' ').trim()
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
