import { cn } from '@/lib/utils';

function PageHeader({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <header
      className={cn(
        'flex items-center justify-between space-y-2 pb-4 border-b mb-6',
        className
      )}
      {...props}
    >
      {children}
    </header>
  );
}

function PageHeaderHeading({
  className,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h1
      className={cn(
        'text-3xl font-bold tracking-tight',
        className
      )}
      {...props}
    />
  );
}

function PageHeaderDescription({
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={cn(
        'text-lg text-muted-foreground',
        className
      )}
      {...props}
    />
  );
}

export { PageHeader, PageHeaderHeading, PageHeaderDescription };
