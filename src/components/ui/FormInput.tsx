import type { ChangeEvent } from 'react';

interface FormInputProps {
  label: string;
  value: string;
  name?: string;
  type?: string;
  multiline?: boolean;
  action?: string;
  placeholder?: string;
  onChange?: (value: string) => void;
}

export function FormInput({ label, value, name, type = 'text', multiline, action, placeholder, onChange }: FormInputProps) {
  const commonProps = {
    name,
    value,
    placeholder,
    readOnly: !onChange,
    onChange: (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => onChange?.(event.target.value),
  };

  return (
    <label className="form-field">
      <span className="form-label-row">
        <span>{label}</span>
        {action && <span className="form-action">{action}</span>}
      </span>
      {multiline ? (
        <textarea className="input-surface textarea-surface" rows={4} {...commonProps} />
      ) : (
        <input className="input-surface" type={type} {...commonProps} />
      )}
    </label>
  );
}
