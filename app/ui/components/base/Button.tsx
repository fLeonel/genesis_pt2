import { styleClasses } from '../../theme/designSystem';

interface ButtonProps {
    children: React.ReactNode;
    variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'outline';
    size?: 'sm' | 'md' | 'lg';
    disabled?: boolean;
    loading?: boolean;
    onClick?: () => void;
    type?: 'button' | 'submit' | 'reset';
    className?: string;
}

export default function Button({
    children,
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    onClick,
    type = 'button',
    className = ''
}: ButtonProps) {
    const sizeClasses = {
        sm: 'py-2 px-3 text-sm',
        md: 'py-2.5 px-4 text-base',
        lg: 'py-3 px-6 text-lg',
    };

    const baseClasses = styleClasses.button[variant];
    const finalClasses = `${baseClasses} ${sizeClasses[size]} ${className} ${disabled || loading ? styleClasses.disabled : ''}`;

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled || loading}
            className={finalClasses}
        >
            {loading ? (
                <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Cargando...
                </div>
            ) : (
                children
            )}
        </button>
    );
}