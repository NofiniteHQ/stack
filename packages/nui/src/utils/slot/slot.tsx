import React from 'react';
import { cn } from '../cn/cn';

type AnyProps = Record<string, unknown>;

/* -------------------------------------------------------------------------------------------------
 * Utility: Compose Refs
 * -----------------------------------------------------------------------------------------------*/
function composeRefs<T>(...refs: (React.Ref<T> | undefined)[]) {
  return (node: T) => {
    refs.forEach((ref) => {
      if (typeof ref === 'function') {
        ref(node);
      } else if (ref != null && typeof ref === 'object') {
        (ref as React.MutableRefObject<T>).current = node;
      }
    });
  };
}

/* -------------------------------------------------------------------------------------------------
 * Utility: Safely Extract Ref
 * Handles both React 18 (ref on element) and React 19 (ref on props) without using `any`.
 * -----------------------------------------------------------------------------------------------*/
function getElementRef(element: React.ReactElement): React.Ref<HTMLElement> | undefined {
  const props = element.props as { ref?: React.Ref<HTMLElement> };
  const el = element as unknown as { ref?: React.Ref<HTMLElement> };
  return props.ref || el.ref;
}

/* -------------------------------------------------------------------------------------------------
 * Utility: Merge Props
 * -----------------------------------------------------------------------------------------------*/
function mergeProps(slotProps: AnyProps, childProps: AnyProps): AnyProps {
  const overrideProps: AnyProps = { ...childProps };

  for (const propName in childProps) {
    const slotPropValue = slotProps[propName];
    const childPropValue = childProps[propName];

    const isHandler = /^on[A-Z]/.test(propName);

    if (isHandler) {
      if (typeof slotPropValue === 'function' && typeof childPropValue === 'function') {
        overrideProps[propName] = (...args: unknown[]) => {
          childPropValue(...args);
          slotPropValue(...args);
        };
      } else if (slotPropValue) {
        overrideProps[propName] = slotPropValue;
      }
    } else if (propName === 'style') {
      overrideProps[propName] = {
        ...(slotPropValue as React.CSSProperties || {}),
        ...(childPropValue as React.CSSProperties || {}),
      };
    } else if (propName === 'className') {
      overrideProps[propName] = cn(slotPropValue as string, childPropValue as string);
    }
  }

  return { ...slotProps, ...overrideProps };
}

/* -------------------------------------------------------------------------------------------------
 * Slottable
 * -----------------------------------------------------------------------------------------------*/
export const Slottable = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>;
};
Slottable.displayName = 'Slottable';

/* -------------------------------------------------------------------------------------------------
 * SlotClone (Internal)
 * -----------------------------------------------------------------------------------------------*/
interface SlotCloneProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
}

const SlotClone = React.forwardRef<HTMLElement, SlotCloneProps>((props, forwardedRef) => {
  const { children, ...slotProps } = props;

  if (React.isValidElement(children)) {
    const childrenRef = getElementRef(children);
    const childProps = children.props as AnyProps;
    const mergedProps = mergeProps(slotProps as AnyProps, childProps);

    // Casting the final merged result to React's expected attributes format
    return React.cloneElement(children, {
      ...mergedProps,
      ref: forwardedRef ? composeRefs(forwardedRef, childrenRef) : childrenRef,
    } as React.HTMLAttributes<HTMLElement> & React.RefAttributes<HTMLElement>);
  }

  return React.Children.count(children) > 1 ? React.Children.only(null) : null;
});
SlotClone.displayName = 'SlotClone';

/* -------------------------------------------------------------------------------------------------
 * Slot (Public)
 * -----------------------------------------------------------------------------------------------*/
export interface SlotProps extends React.HTMLAttributes<HTMLElement> {
  children?: React.ReactNode;
}

export const Slot = React.forwardRef<HTMLElement, SlotProps>((props, forwardedRef) => {
  const { children, ...slotProps } = props;
  const childrenArray = React.Children.toArray(children);

  // Type Guard: Safely verify this is a Slottable component and extract its strict prop types
  const slottable = childrenArray.find(
    (child): child is React.ReactElement<{ children: React.ReactNode }> =>
      React.isValidElement(child) && child.type === Slottable
  );

  if (slottable) {
    // Because of the type guard above, TypeScript now knows slottable.props is safe to access
    const newElement = slottable.props.children;

    const newChildren = childrenArray.map((child) => {
      if (child === slottable) {
        // Another safety check before trying to read the Next.js Link's children
        if (React.isValidElement(newElement)) {
          return (newElement.props as { children?: React.ReactNode }).children;
        }
        return null;
      }
      return child;
    });

    return (
      <SlotClone {...slotProps} ref={forwardedRef}>
        {React.isValidElement(newElement)
          ? React.cloneElement(newElement, undefined, newChildren)
          : null}
      </SlotClone>
    );
  }

  return (
    <SlotClone {...slotProps} ref={forwardedRef}>
      {children}
    </SlotClone>
  );
});
Slot.displayName = 'Slot';