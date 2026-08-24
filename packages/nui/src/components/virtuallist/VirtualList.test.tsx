import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { createRef } from 'react';
import { axe } from 'vitest-axe';
import { VirtualList, VirtualListHandle } from './VirtualList';

const MOCK_ITEMS = Array.from({ length: 1000 }, (_, i) => ({
 id: i,
 name: `Item ${i}`,
}));
const ITEM_HEIGHT = 40;
const VIEWPORT_HEIGHT = 400;

describe('VirtualList Component', () => {
 it('renders correctly with ARIA compliance', () => {
 render(
 <VirtualList
 items={MOCK_ITEMS}
 height={VIEWPORT_HEIGHT}
 itemHeight={ITEM_HEIGHT}
 renderItem={(item) => <div>{item.name}</div>}
 />
 );

 expect(screen.getByRole('list')).toBeInTheDocument();
 
 // Verify initial window size (Viewport / ItemHeight + Overscan)
 // 400 / 40 = 10 items.
 // endIndex = 10 + 3 overscan = 13.
 // Indices 0 through 13 inclusive = 14 total items rendered.
 const items = screen.getAllByRole('listitem');
 expect(items.length).toBe(14);
 });

  it('calculates the correct translation offset for absolute items during scroll', () => {
    const { container } = render(
      <VirtualList
        items={MOCK_ITEMS}
        height={VIEWPORT_HEIGHT}
        itemHeight={ITEM_HEIGHT}
        overscan={0} // Disable overscan for precise math check
        renderItem={(item) => <div>{item.name}</div>}
      />
    );

    const viewport = container.firstChild as HTMLElement;

    // Scroll down 200px (Exactly 5 items)
    fireEvent.scroll(viewport, { target: { scrollTop: 200 } });

    // startIndex should be 5. Item 5 should be the first rendered item, transformed by 5 * 40 = 200px
    const item5 = screen.getByText('Item 5').closest('[role="listitem"]') as HTMLElement;
    expect(item5).toBeInTheDocument();
    expect(item5.style.transform).toBe('translateY(200px)');
    
    // Item 0 should be culled from the DOM
    expect(screen.queryByText('Item 0')).not.toBeInTheDocument();
  });

 it('preserves consumer onScroll handlers', () => {
 const onScrollSpy = vi.fn();
 const { container } = render(
 <VirtualList
 items={MOCK_ITEMS}
 height={VIEWPORT_HEIGHT}
 onScroll={onScrollSpy}
 renderItem={(item) => <div>{item.name}</div>}
 />
 );

 fireEvent.scroll(container.firstChild as HTMLElement, { target: { scrollTop: 100 } });
 expect(onScrollSpy).toHaveBeenCalled();
 });

  it('supports custom imperative handle refs', () => {
    const ref = createRef<VirtualListHandle>();
    render(
      <VirtualList
        ref={ref}
        items={MOCK_ITEMS}
        height={VIEWPORT_HEIGHT}
        renderItem={() => null}
      />
    );
    expect(ref.current).toBeDefined();
    expect(ref.current?.element).toBeInstanceOf(HTMLDivElement);
    expect(typeof ref.current?.scrollToIndex).toBe('function');
  });

 it('uses keyExtractor for stable row identity', () => {
 const keyExtractorSpy = vi.fn((item) => item.id);
 render(
 <VirtualList
 items={MOCK_ITEMS.slice(0, 10)}
 height={VIEWPORT_HEIGHT}
 keyExtractor={keyExtractorSpy}
 renderItem={(item) => <div>{item.name}</div>}
 />
 );
 expect(keyExtractorSpy).toHaveBeenCalled();
 });

 it('has no accessibility violations', async () => {
 const { container } = render(
 <VirtualList
 items={MOCK_ITEMS}
 height={VIEWPORT_HEIGHT}
 itemHeight={ITEM_HEIGHT}
 renderItem={(item) => <div>{item.name}</div>}
 />
 );
 expect(await axe(container)).toHaveNoViolations();
 });
});