// @vitest-environment happy-dom
import { describe, it, expect } from 'vitest';
import { renderKanbanHTML } from './core/board';
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
