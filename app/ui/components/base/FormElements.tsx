import { styleClasses } from '../../theme/designSystem';

interface InputProps {
    label?: string;
    placeholder?: string;
    value?: string | number;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    type?: 'text' | 'email' | 'password' | 'number' | 'tel';
    required?: boolean;
    disabled?: boolean;
    error?: string;
    className?: string;
}

export default function Input({
    label,
    placeholder,
    value,
    onChange,
    type = 'text',
    required = false,
    disabled = false,
    error,
    className = ''
}: InputProps) {
    return (
        <div className={className}>
            {label && (
                <label className={styleClasses.label}>
                    {label}
                    {required && <span className="text-red-500 ml-1">*</span>}
                </label>
            )}
            <input
                type={type}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                required={required}
                disabled={disabled}
                className={`${styleClasses.input} ${error ? 'border-red-300 focus:ring-red-500' : ''} ${disabled ? styleClasses.disabled : ''}`}
            />
            {error && (
                <p className="mt-1 text-sm text-red-600">{error}</p>
            )}
        </div>
    );
}

interface TextareaProps {
    label?: string;
    placeholder?: string;
    value?: string;
    onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    rows?: number;
    required?: boolean;
    disabled?: boolean;
    error?: string;
    className?: string;
}

export function Textarea({
    label,
    placeholder,
    value,
    onChange,
    rows = 3,
    required = false,
    disabled = false,
    error,
    className = ''
}: TextareaProps) {
    return (
        <div className={className}>
            {label && (
                <label className={styleClasses.label}>
                    {label}
                    {required && <span className="text-red-500 ml-1">*</span>}
                </label>
            )}
            <textarea
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                rows={rows}
                required={required}
                disabled={disabled}
                className={`${styleClasses.textarea} ${error ? 'border-red-300 focus:ring-red-500' : ''} ${disabled ? styleClasses.disabled : ''}`}
            />
            {error && (
                <p className="mt-1 text-sm text-red-600">{error}</p>
            )}
        </div>
    );
}

interface SelectProps {
    label?: string;
    value?: string;
    onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    options: { value: string; label: string }[];
    placeholder?: string;
    required?: boolean;
    disabled?: boolean;
    error?: string;
    className?: string;
}

export function Select({
    label,
    value,
    onChange,
    options,
    placeholder,
    required = false,
    disabled = false,
    error,
    className = ''
}: SelectProps) {
    return (
        <div className={className}>
            {label && (
                <label className={styleClasses.label}>
                    {label}
                    {required && <span className="text-red-500 ml-1">*</span>}
                </label>
            )}
            <select
                value={value}
                onChange={onChange}
                required={required}
                disabled={disabled}
                className={`${styleClasses.select} ${error ? 'border-red-300 focus:ring-red-500' : ''} ${disabled ? styleClasses.disabled : ''}`}
            >
                {placeholder && <option value="">{placeholder}</option>}
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
            {error && (
                <p className="mt-1 text-sm text-red-600">{error}</p>
            )}
        </div>
    );
}