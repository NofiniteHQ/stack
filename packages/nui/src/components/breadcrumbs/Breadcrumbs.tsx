import React from 'react';
import { cn } from '../../utils';

export interface BreadcrumbItem {
 label: React.ReactNode;
 /** If provided, renders the item as an <a> tag */
 href?: string;
 /** Triggered when the breadcrumb is clicked */
 onClick?: (e: React.MouseEvent) => void;
}

export interface BreadcrumbsProps extends React.HTMLAttributes<HTMLElement> {
 /** Array of items for Smart Default mode */
 data?: BreadcrumbItem[];
 /** The maximum number of items to display before truncating the middle path. Default: 5 */
 maxItems?: number;
 /** The visual separator between items. Default: '›' */
 separator?: React.ReactNode;
 children?: React.ReactNode;
}

const BreadcrumbsContext = React.createContext<{ separator: React.ReactNode }>({ separator: '›' });

const BreadcrumbsRoot = React.forwardRef<HTMLElement, BreadcrumbsProps>(({
 data,
 maxItems = 5,
 separator = '›',
 className,
 children,
 ...props
}, ref) => {
 return (
  <BreadcrumbsContext.Provider value={{ separator }}>
   <nav 
    ref={ref}
    aria-label="Breadcrumb"
    className={cn("font-sans text-sm", className)} 
    {...props}
   >
    <ol className="flex flex-wrap items-center p-0 m-0 list-none gap-2">
     {data ? (() => {
      if (!data.length) return null;
      let renderItems: (BreadcrumbItem | 'ellipsis')[] = data;
      if (data.length > maxItems) {
       const start = data.slice(0, 1); 
       const end = data.slice(-2); 
       renderItems = [...start, 'ellipsis', ...end];
      }
      return renderItems.map((item, index) => {
       const isLast = index === renderItems.length - 1;
       const key = `crumb-${index}`;

       if (item === 'ellipsis') {
        return (
         <BreadcrumbsItem key={key}>
          <span className="text-muted flex items-center justify-center" aria-hidden="true">…</span>
          <BreadcrumbsSeparator />
         </BreadcrumbsItem>
        );
       }

       const { label, href, onClick } = item;
       const isInteractive = Boolean(href || onClick) && !isLast;
       
       return (
        <BreadcrumbsItem key={key}>
         {isInteractive ? (
          <BreadcrumbsLink href={href} onClick={onClick}>{label}</BreadcrumbsLink>
         ) : (
          <BreadcrumbsPage isCurrentPage={isLast}>{label}</BreadcrumbsPage>
         )}
         {!isLast && <BreadcrumbsSeparator />}
        </BreadcrumbsItem>
       );
      });
     })() : children}
    </ol>
   </nav>
  </BreadcrumbsContext.Provider>
 );
});
BreadcrumbsRoot.displayName = 'Breadcrumbs';

const BreadcrumbsList = React.forwardRef<HTMLOListElement, React.OlHTMLAttributes<HTMLOListElement>>(({
 className,
 ...props
}, ref) => (
 <ol ref={ref} className={cn("flex flex-wrap items-center p-0 m-0 list-none gap-2", className)} {...props} />
));
BreadcrumbsList.displayName = 'Breadcrumbs.List';

const BreadcrumbsItem = React.forwardRef<HTMLLIElement, React.LiHTMLAttributes<HTMLLIElement>>(({
 className,
 ...props
}, ref) => (
 <li ref={ref} className={cn("inline-flex items-center gap-2", className)} {...props} />
));
BreadcrumbsItem.displayName = 'Breadcrumbs.Item';

const BreadcrumbsLink = React.forwardRef<HTMLAnchorElement, React.AnchorHTMLAttributes<HTMLAnchorElement>>(({
 className,
 ...props
}, ref) => (
 <a
  ref={ref}
  className={cn("text-muted no-underline transition-colors cursor-pointer hover:text-primary hover:underline hover:decoration-primary focus-visible:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--nui-fg-default)]", className)}
  {...props}
 />
));
BreadcrumbsLink.displayName = 'Breadcrumbs.Link';

interface BreadcrumbsPageProps extends React.HTMLAttributes<HTMLSpanElement> {
 isCurrentPage?: boolean;
}

const BreadcrumbsPage = React.forwardRef<HTMLSpanElement, BreadcrumbsPageProps>(({
 className,
 isCurrentPage = true,
 ...props
}, ref) => (
 <span
  ref={ref}
  className={cn(
   "text-muted no-underline transition-colors cursor-pointer hover:text-default hover:underline hover:decoration-default", 
   isCurrentPage && "!text-default font-medium cursor-default pointer-events-none hover:no-underline",
   className
  )}
  aria-current={isCurrentPage ? 'page' : undefined}
  {...props}
 />
));
BreadcrumbsPage.displayName = 'Breadcrumbs.Page';

const BreadcrumbsSeparator = React.forwardRef<HTMLSpanElement, React.HTMLAttributes<HTMLSpanElement>>(({
 className,
 children,
 ...props
}, ref) => {
 const { separator } = React.useContext(BreadcrumbsContext);
 return (
  <span ref={ref} className={cn("text-muted select-none text-[0.9em]", className)} aria-hidden="true" {...props}>
   {children ?? separator}
  </span>
 );
});
BreadcrumbsSeparator.displayName = 'Breadcrumbs.Separator';

export const Breadcrumbs = Object.assign(BreadcrumbsRoot, {
 List: BreadcrumbsList,
 Item: BreadcrumbsItem,
 Link: BreadcrumbsLink,
 Page: BreadcrumbsPage,
 Separator: BreadcrumbsSeparator,
});