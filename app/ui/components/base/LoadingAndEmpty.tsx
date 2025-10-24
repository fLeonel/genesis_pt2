interface LoadingSpinnerProps {
    size?: 'sm' | 'md' | 'lg';
    color?: 'blue' | 'gray' | 'white';
    className?: string;
}

export default function LoadingSpinner({
    size = 'md',
    color = 'blue',
    className = ''
}: LoadingSpinnerProps) {
    const sizeClasses = {
        sm: 'h-4 w-4',
        md: 'h-8 w-8',
        lg: 'h-12 w-12',
    };

    const colorClasses = {
        blue: 'border-blue-600',
        gray: 'border-gray-600',
        white: 'border-white',
    };

    return (
        <div className={`animate-spin rounded-full border-2 border-t-transparent ${sizeClasses[size]} ${colorClasses[color]} ${className}`}></div>
    );
}

interface LoadingStateProps {
    message?: string;
    className?: string;
}

export function LoadingState({ message = 'Cargando...', className = '' }: LoadingStateProps) {
    return (
        <div className={`flex flex-col items-center justify-center py-12 ${className}`}>
            <LoadingSpinner size="lg" />
            <p className="mt-4 text-gray-600 text-lg">{message}</p>
        </div>
    );
}

interface EmptyStateProps {
    title: string;
    description?: string;
    icon?: React.ReactNode;
    action?: React.ReactNode;
    className?: string;
}

export function EmptyState({
    title,
    description,
    icon,
    action,
    className = ''
}: EmptyStateProps) {
    return (
        <div className={`text-center py-12 ${className}`}>
            {icon && (
                <div className="flex justify-center mb-4 text-6xl text-gray-400">
                    {icon}
                </div>
            )}
            <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
            {description && (
                <p className="text-gray-600 mb-6">{description}</p>
            )}
            {action && action}
        </div>
    );
}