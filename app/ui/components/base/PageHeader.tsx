import { styleClasses } from '../../theme/designSystem';

interface PageHeaderProps {
    title: string;
    subtitle?: string;
    children?: React.ReactNode;
    className?: string;
}

export default function PageHeader({
    title,
    subtitle,
    children,
    className = ''
}: PageHeaderProps) {
    return (
        <div className={`${styleClasses.container} ${className}`}>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
                <div>
                    <h1 className={styleClasses.pageTitle}>{title}</h1>
                    {subtitle && (
                        <p className="text-gray-600 text-lg">{subtitle}</p>
                    )}
                </div>
                {children && (
                    <div className="mt-4 sm:mt-0 flex flex-col sm:flex-row gap-3">
                        {children}
                    </div>
                )}
            </div>
        </div>
    );
}