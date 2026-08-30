import React from 'react';
import { ArrowLeft, Search } from 'lucide-react';

type PageHeaderProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  icon?: React.ReactNode;
  backLabel?: string;
  onBack?: () => void;
  actions?: React.ReactNode;
  context?: React.ReactNode;
};

export const RedwoodPage: React.FC<React.PropsWithChildren<{ className?: string }>> = ({ children, className = '' }) => (
  <div className={`redwood-template ${className}`}>{children}</div>
);

export const RedwoodPageHeader: React.FC<PageHeaderProps> = ({
  eyebrow,
  title,
  description,
  icon,
  backLabel,
  onBack,
  actions,
  context,
}) => (
  <header className="redwood-template-header">
    <div className="redwood-template-heading">
      {onBack && (
        <button type="button" onClick={onBack} className="btn btn-ghost btn-sm -ml-2 w-fit gap-2">
          <ArrowLeft size={17} aria-hidden />
          {backLabel ?? 'Back'}
        </button>
      )}
      <div className="flex items-start gap-3">
        {icon && <span className="redwood-template-icon" aria-hidden>{icon}</span>}
        <div className="min-w-0">
          {eyebrow && <p className="redwood-kicker">{eyebrow}</p>}
          <h1 className="app-page-title mt-1">{title}</h1>
          {description && <p className="app-page-description">{description}</p>}
        </div>
      </div>
      {context && <div className="redwood-context-row">{context}</div>}
    </div>
    {actions && <div className="redwood-template-actions">{actions}</div>}
  </header>
);

type RedwoodSectionProps = React.PropsWithChildren<{
  title?: string;
  description?: string;
  actions?: React.ReactNode;
  contentMode?: 'padded' | 'flush';
  className?: string;
}>;

export const RedwoodSection: React.FC<RedwoodSectionProps> = ({
  title,
  description,
  actions,
  contentMode = 'padded',
  className = '',
  children,
}) => (
  <section className={`redwood-section ${className}`}>
    {(title || description || actions) && (
      <div className="redwood-section-header">
        <div>
          {title && <h2 className="redwood-section-title">{title}</h2>}
          {description && <p className="redwood-section-description">{description}</p>}
        </div>
        {actions && <div className="redwood-section-actions">{actions}</div>}
      </div>
    )}
    <div className={contentMode === 'flush' ? '' : 'redwood-section-content'}>{children}</div>
  </section>
);

type CollectionToolbarProps = {
  search?: {
    value: string;
    onChange: (value: string) => void;
    placeholder: string;
    label?: string;
  };
  summary?: React.ReactNode;
  filters?: React.ReactNode;
  actions?: React.ReactNode;
};

export const RedwoodCollectionToolbar: React.FC<CollectionToolbarProps> = ({ search, summary, filters, actions }) => (
  <div className="redwood-collection-toolbar">
    <div className="flex min-w-0 flex-1 flex-wrap items-center gap-3">
      {search && (
        <label className="redwood-search-field">
          <span className="sr-only">{search.label ?? search.placeholder}</span>
          <Search size={17} aria-hidden />
          <input
            type="search"
            value={search.value}
            onChange={(event) => search.onChange(event.target.value)}
            placeholder={search.placeholder}
          />
        </label>
      )}
      {filters}
    </div>
    <div className="flex flex-wrap items-center justify-end gap-3">
      {summary && <div className="redwood-collection-summary">{summary}</div>}
      {actions}
    </div>
  </div>
);

type EmptyStateProps = {
  icon?: React.ReactNode;
  title: string;
  description: string;
  action?: React.ReactNode;
};

export const RedwoodEmptyState: React.FC<EmptyStateProps> = ({ icon, title, description, action }) => (
  <div className="redwood-empty-state">
    {icon && <span className="redwood-empty-icon" aria-hidden>{icon}</span>}
    <div className="max-w-md">
      <h3 className="text-base font-semibold text-base-content">{title}</h3>
      <p className="mt-1 text-sm leading-6 text-base-content/65">{description}</p>
    </div>
    {action}
  </div>
);

export const RedwoodContextItem: React.FC<{ label: string; value: React.ReactNode }> = ({ label, value }) => (
  <div className="redwood-context-item">
    <span>{label}</span>
    <strong>{value}</strong>
  </div>
);

export const RedwoodFormActions: React.FC<React.PropsWithChildren<{ message?: React.ReactNode }>> = ({ message, children }) => (
  <footer className="redwood-form-actions">
    <div className="min-w-0 text-sm text-base-content/60">{message}</div>
    <div className="flex flex-wrap items-center justify-end gap-3">{children}</div>
  </footer>
);
