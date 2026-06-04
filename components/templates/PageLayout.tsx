type Props = { children: React.ReactNode };

export function PageLayout({ children }: Props) {
  return <div className="mx-auto w-full max-w-page">{children}</div>;
}
