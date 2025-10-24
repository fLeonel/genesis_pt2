import { styleClasses } from '../../theme/designSystem';

interface BadgeProps {
    children: React.ReactNode;
    variant?: 'primary' | 'success' | 'warning' | 'danger' | 'gray';
    size?: 'sm' | 'md' | 'lg';
    className?: string;
}

export default function Badge({
    children,
    variant = 'gray',
    size = 'md',
    className = ''
}: BadgeProps) {
    const sizeClasses = {
        sm: 'px-2 py-0.5 text-xs',
        md: 'px-2.5 py-0.5 text-xs',
        lg: 'px-3 py-1 text-sm',
    };

    const baseClasses = styleClasses.badge[variant];
    const finalClasses = `${baseClasses} ${sizeClasses[size]} ${className}`;

    return (
        <span className={finalClasses}>
            {children}
        </span>
    );
}