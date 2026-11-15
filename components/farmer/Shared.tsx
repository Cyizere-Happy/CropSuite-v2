import type { ReactNode } from "react";
import { Icon, type IconName } from "./Icon";

export function LoadingState() {
  return <main className="cs-loading" role="status"><Icon name="sprout" /> Opening your farm plan…</main>;
}

export function EmptyState({ icon = "info", title, children }: { icon?: IconName; title: string; children?: ReactNode }) {
  return <div className="cs-empty"><span><Icon name={icon} /></span><h3>{title}</h3>{children && <div>{children}</div>}</div>;
}

export function Field({ label, name, error, optional, hint, children }: {
  label: string; name: string; error?: string; optional?: boolean; hint?: string; children: ReactNode;
}) {
  return (
    <div className="cs-form-field">
      <label htmlFor={name}>{label} {optional && <span>Optional</span>}</label>
      {children}
      {hint && <p className="cs-form-hint" id={name + "-hint"}>{hint}</p>}
      {error && <FieldError name={name}>{error}</FieldError>}
    </div>
  );
}

export function FieldError({ name, children }: { name: string; children: ReactNode }) {
  return <p className="cs-form-error" id={name + "-error"}>{children}</p>;
}

export function Notice({ children }: { children: ReactNode }) {
  return <div className="cs-notice"><Icon name="info" /> <div>{children}</div></div>;
}

const optionLabels: Record<string, string> = {
  "Available": "Yes",
  "Limited or seasonal": "Sometimes",
  "Unavailable": "No",
  "Can obtain inputs": "Yes",
  "Limited access": "Sometimes",
  "Cannot obtain inputs": "No",
};

export function displayOption(value: string) {
  return optionLabels[value] || value;
}

export function Options({ options, placeholder = "Choose an option" }: { options: readonly string[]; placeholder?: string }) {
  return <><option value="">{placeholder}</option>{options.map((option) => <option key={option} value={option}>{displayOption(option)}</option>)}</>;
}

export function ChoiceCard({ label, description, icon, selected, onClick }: {
  label: string; description?: string; icon?: IconName; selected: boolean; onClick: () => void;
}) {
  return (
    <button className="cs-choice" aria-pressed={selected} type="button" onClick={onClick}>
      {icon && <span className="cs-choice-icon"><Icon name={icon} /></span>}
      <span><strong>{label}</strong>{description && <small>{description}</small>}</span>
      <span className="cs-choice-check">{selected && <Icon name="check" />}</span>
    </button>
  );
}

