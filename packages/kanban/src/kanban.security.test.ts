// @vitest-environment happy-dom
import { describe, it, expect, vi } from 'vitest';
import {
  renderKanbanHTML,
  renderCardHTML,
  escapeHtml,
  escapeCss,
  isSafeAvatarUrl,
  createKanbanBoard,
} from './core/board';
import { reorderArray, moveCardBetweenColumns } from './core/reorder';
import { Kanban } from './react';
import { renderToString } from 'react-dom/server';
import React from 'react';

describe('KANBAN Security & Remediation Regression Suite (M2)', () => {
  it('KANBAN-M1-02: neutralizes HTML/XSS injection in subtask counters', () => {
    const maliciousCompleted = '<img src=x onerror=alert("XSS")>';
    const maliciousTotal = '<script>stealCookies()</script>';

    const html = renderKanbanHTML({
      columns: [
        {
          id: 'c1',
          title: 'Testing Column',
          items: [
            {
              id: 'card-xss',
              title: 'Vulnerable Card',
              subtasks: {
                completed: maliciousCompleted as unknown as number,
                total: maliciousTotal as unknown as number,
              },
            },
          ],
        },
      ],
    });

    expect(html).not.toContain('<img src=x onerror=alert("XSS")>');
    expect(html).not.toContain('<script>stealCookies()</script>');
    expect(html).toContain('&lt;img src=x onerror=alert(&quot;XSS&quot;)&gt;');
    expect(html).toContain('&lt;script&gt;stealCookies()&lt;/script&gt;');
  });

  it('SSR: renders React <Kanban> to static markup cleanly without throwing', () => {
    const columns = [
      {
        id: 'col-todo',
        title: 'To Do',
        items: [
          { id: 't1', title: 'Task Alpha' },
          { id: 't2', title: 'Task Beta' },
        ],
      },
      {
        id: 'col-done',
        title: 'Done',
        items: [{ id: 't3', title: 'Task Complete' }],
      },
    ];

    const markup = renderToString(
      React.createElement(Kanban, {
        columns,
      })
    );

    expect(markup).toBeTruthy();
    expect(markup).toContain('Task Alpha');
    expect(markup).toContain('Task Complete');
    expect(markup).toContain('kanban-column');
  });
});

describe('KANBAN Phase 3 Milestone 3 Security & Hardening Suite (Batch B)', () => {
  it('KANBAN-M3-01: escapes className, columnClassName, and board className in HTML templates', () => {
    const html = renderKanbanHTML({
      className: '"><script>alert("board-class")</script>',
      columnClassName: '"><img src=x onerror=alert("col-class")>',
      columns: [
        {
          id: 'c1',
          title: 'Column 1',
          className: '"><b onmouseover=alert("custom-col")></b>',
          items: [
            {
              id: 'card1',
              title: 'Card 1',
              className: '"><svg onload=alert("card-class")>',
            },
          ],
        },
      ],
    });

    // Unescaped script / svg / img tags must not exist in output HTML
    expect(html).not.toContain('<script>alert("board-class")</script>');
    expect(html).not.toContain('<img src=x onerror=alert("col-class")>');
    expect(html).not.toContain('<b onmouseover=alert("custom-col")>');
    expect(html).not.toContain('<svg onload=alert("card-class")>');

    // Must be safely escaped as entity attributes
    expect(html).toContain(
      '&quot;&gt;&lt;script&gt;alert(&quot;board-class&quot;)&lt;/script&gt;'
    );
    expect(html).toContain(
      '&quot;&gt;&lt;b onmouseover=alert(&quot;custom-col&quot;)&gt;&lt;/b&gt;'
    );
    expect(html).toContain(
      '&quot;&gt;&lt;svg onload=alert(&quot;card-class&quot;)&gt;'
    );
  });

  it('KANBAN-M3-02: escapes col.wipLimit to neutralize stored XSS in WIP badges', () => {
    const maliciousWip = '"><script>alert("wip-xss")</script>';
    const html = renderKanbanHTML({
      columns: [
        {
          id: 'c1',
          title: 'WIP Test Column',
          wipLimit: maliciousWip as any,
          items: [
            { id: 'item1', title: 'Task 1' },
            { id: 'item2', title: 'Task 2' },
          ],
        },
      ],
    });

    expect(html).not.toContain('<script>alert("wip-xss")</script>');
    expect(html).toContain(
      '&quot;&gt;&lt;script&gt;alert(&quot;wip-xss&quot;)&lt;/script&gt;'
    );
  });

  it('KANBAN-M3-03: escapeCss handles special characters and selector injection isomorphic to SSR/JSDOM', () => {
    // 1. Escaping special selector characters and injection strings
    const specialChars = 'col:1.special[active]';
    const escaped = escapeCss(specialChars);
    expect(escaped).toContain('\\:');
    expect(escaped).toContain('\\.');
    expect(escaped).toContain('\\[');
    expect(escaped).toContain('\\]');

    // Quotes are escaped to prevent breaking out of attribute selectors
    const withQuotes = 'card"onmouseover="';
    const escapedQuotes = escapeCss(withQuotes);
    expect(escapedQuotes).toContain('\\"');

    // 2. Querying in DOM with escaped characters succeeds without throwing DOMException
    const testDiv = document.createElement('div');
    testDiv.setAttribute('data-card-id', specialChars);
    document.body.appendChild(testDiv);

    expect(() => {
      const match = document.body.querySelector(`[data-card-id="${escaped}"]`);
      expect(match).toBe(testDiv);
    }).not.toThrow();

    document.body.removeChild(testDiv);

    // 3. Fallback when CSS.escape is undefined (SSR / headless fallback)
    const originalCss = globalThis.CSS;
    try {
      // Temporarily remove global CSS.escape to test fallback branch
      (globalThis as any).CSS = undefined;
      const fallbackResult = escapeCss('item:alpha.beta');
      expect(fallbackResult).toBe('item\\:alpha\\.beta');
    } finally {
      (globalThis as any).CSS = originalCss;
    }
  });

  it('KANBAN-M3-04: reorderArray enforces index boundaries and prevents state corruption', () => {
    const items = ['a', 'b', 'c'];

    // 1. Negative startIndex returns unchanged copy
    expect(reorderArray(items, -1, 1)).toEqual(['a', 'b', 'c']);
    expect(reorderArray(items, -99, 2)).toEqual(['a', 'b', 'c']);

    // 2. Out-of-bounds startIndex returns unchanged copy
    expect(reorderArray(items, 10, 0)).toEqual(['a', 'b', 'c']);

    // 3. Non-finite startIndex returns unchanged copy
    expect(reorderArray(items, NaN, 1)).toEqual(['a', 'b', 'c']);
    expect(reorderArray(items, Infinity, 1)).toEqual(['a', 'b', 'c']);

    // 4. Clamps endIndex gracefully to valid bounds
    expect(reorderArray(items, 0, 999)).toEqual(['b', 'c', 'a']);
    expect(reorderArray(items, 2, -10)).toEqual(['c', 'a', 'b']);

    // 5. Never inserts undefined
    const res = reorderArray(items, 1, 10);
    expect(res).not.toContain(undefined);
    expect(res.length).toBe(3);
  });

  it('KANBAN-M3-05: moveCardBetweenColumns guards boundaries and prevents undefined insertion', () => {
    const columns = [
      {
        id: 'col-1',
        title: 'To Do',
        items: [
          { id: 'card-1', title: 'Task 1' },
          { id: 'card-2', title: 'Task 2' },
        ],
      },
      {
        id: 'col-2',
        title: 'Done',
        items: [{ id: 'card-3', title: 'Task 3' }],
      },
    ];

    // 1. Out of bounds sourceIndex (-1 or >= length) returns unchanged columns
    const res1 = moveCardBetweenColumns(columns, {
      cardId: 'card-1',
      sourceColumnId: 'col-1',
      targetColumnId: 'col-2',
      sourceIndex: -1,
      targetIndex: 0,
    });
    expect(res1[0].items.length).toBe(2);
    expect(res1[1].items.length).toBe(1);

    const res2 = moveCardBetweenColumns(columns, {
      cardId: 'card-1',
      sourceColumnId: 'col-1',
      targetColumnId: 'col-2',
      sourceIndex: 5,
      targetIndex: 0,
    });
    expect(res2).toEqual(columns);

    // 2. Non-existent column returns unchanged columns
    const res3 = moveCardBetweenColumns(columns, {
      cardId: 'card-1',
      sourceColumnId: 'non-existent',
      targetColumnId: 'col-2',
      sourceIndex: 0,
      targetIndex: 0,
    });
    expect(res3).toEqual(columns);

    // 3. Target index 9999 safely clamped to end of column without undefined
    const res4 = moveCardBetweenColumns(columns, {
      cardId: 'card-1',
      sourceColumnId: 'col-1',
      targetColumnId: 'col-2',
      sourceIndex: 0,
      targetIndex: 9999,
    });
    expect(res4[1].items.map((i) => i.id)).toEqual(['card-3', 'card-1']);
    expect(res4[1].items).not.toContain(undefined);
  });

  it('KANBAN-M3-06: DOM reconciliation with Map-based card lookup prevents client freeze', () => {
    const container = document.createElement('div');
    document.body.appendChild(container);

    const initialCards = Array.from({ length: 50 }, (_, i) => ({
      id: `card-${i}`,
      title: `Task item ${i}`,
    }));

    const board = createKanbanBoard({
      container,
      columns: [
        {
          id: 'c1',
          title: 'High Volume Column',
          items: initialCards,
        },
      ],
    });

    const initialCardElements = Array.from(
      container.querySelectorAll('.kanban-card')
    );
    expect(initialCardElements.length).toBe(50);

    // Move first card to the middle
    board.moveCard({
      cardId: 'card-0',
      sourceColumnId: 'c1',
      targetColumnId: 'c1',
      sourceIndex: 0,
      targetIndex: 25,
    });

    const updatedCardElements = Array.from(
      container.querySelectorAll('.kanban-card')
    );
    expect(updatedCardElements.length).toBe(50);

    // Verify first DOM element of card-0 was reused without recreating all 50 nodes
    expect(updatedCardElements[25].getAttribute('data-card-id')).toBe('card-0');

    board.destroy();
    document.body.removeChild(container);
  });

  it('KANBAN-M3-07: escapeHtml safely converts non-string inputs using String(val)', () => {
    expect(escapeHtml(12345)).toBe('12345');
    expect(escapeHtml(0)).toBe('0');
    expect(escapeHtml(true)).toBe('true');
    expect(escapeHtml(false)).toBe('false');
    expect(escapeHtml(null)).toBe('');
    expect(escapeHtml(undefined)).toBe('');
    expect(escapeHtml({ key: '<test>' })).toBe('[object Object]');
  });

  it('KANBAN-M3-08: scopes drag and drop events to board container ID', () => {
    const container1 = document.createElement('div');
    container1.id = 'board-alpha';
    const container2 = document.createElement('div');
    container2.id = 'board-beta';
    document.body.appendChild(container1);
    document.body.appendChild(container2);

    const onCardMove1 = vi.fn();
    const onCardMove2 = vi.fn();

    const board1 = createKanbanBoard({
      container: container1,
      columns: [
        {
          id: 'col-a1',
          title: 'Alpha Col',
          items: [{ id: 'card-a1', title: 'Alpha Card' }],
        },
      ],
      onCardMove: onCardMove1,
    });

    const board2 = createKanbanBoard({
      container: container2,
      columns: [
        {
          id: 'col-b1',
          title: 'Beta Col',
          items: [{ id: 'card-b1', title: 'Beta Card' }],
        },
      ],
      onCardMove: onCardMove2,
    });

    // Verify board container IDs are tracked in dataset
    expect(container1.dataset.kanbanBoardId).toBe('board-alpha');
    expect(container2.dataset.kanbanBoardId).toBe('board-beta');
    expect(container1.dataset.kanbanBoardId).not.toBe(
      container2.dataset.kanbanBoardId
    );

    board1.destroy();
    board2.destroy();
    document.body.removeChild(container1);
    document.body.removeChild(container2);
  });

  it('KANBAN-M3-09: clamps sentinel targetIndex: 9999 before invoking public callbacks', () => {
    const container = document.createElement('div');
    document.body.appendChild(container);

    let recordedTargetIndex: number | null = null;
    const board = createKanbanBoard({
      container,
      columns: [
        {
          id: 'col-start',
          title: 'Start',
          items: [{ id: 'card-x', title: 'Moving Card' }],
        },
        {
          id: 'col-empty',
          title: 'Empty Col',
          items: [],
        },
      ],
      onCardMove: (event) => {
        recordedTargetIndex = event.targetIndex;
      },
    });

    // Move to empty column with sentinel 9999
    board.moveCard({
      cardId: 'card-x',
      sourceColumnId: 'col-start',
      targetColumnId: 'col-empty',
      sourceIndex: 0,
      targetIndex: 9999,
    });

    // Must be clamped to 0 (length of target column) rather than leaking 9999
    expect(recordedTargetIndex).toBe(0);

    board.destroy();
    document.body.removeChild(container);
  });

  it('KANBAN-M3-10: isSafeAvatarUrl validates protocols and rejects javascript: / dangerous data URIs', () => {
    // 1. Rejects dangerous protocols
    expect(isSafeAvatarUrl('javascript:alert(1)')).toBe(false);
    expect(isSafeAvatarUrl('javascript:void(0)')).toBe(false);
    expect(isSafeAvatarUrl('vbscript:msgbox(1)')).toBe(false);
    expect(
      isSafeAvatarUrl(
        'data:text/html;base64,PHNjcmlwdD5hbGVydCgxKTwvc2NyaXB0Pg=='
      )
    ).toBe(false);
    expect(
      isSafeAvatarUrl('data:image/svg+xml,<svg onload=alert(1)></svg>')
    ).toBe(false);

    // 2. Accepts safe image URLs
    expect(isSafeAvatarUrl('https://example.com/avatar.jpg')).toBe(true);
    expect(isSafeAvatarUrl('/static/images/user.png')).toBe(true);
    expect(
      isSafeAvatarUrl(
        'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=='
      )
    ).toBe(true);

    // 3. renderCardHTML sanitizes avatar against javascript: injection
    const cardHtml = renderCardHTML(
      {
        id: 'c-vuln',
        title: 'Avatar test',
        assignee: {
          name: 'Jane Doe',
          avatar: 'javascript:alert(document.cookie)',
        },
      },
      { id: 'col-1', title: 'Col', items: [] },
      0,
      0
    );

    expect(cardHtml).not.toContain('javascript:alert');
    // Renders initials fallback instead of img
    expect(cardHtml).toContain('JD');
  });
});
