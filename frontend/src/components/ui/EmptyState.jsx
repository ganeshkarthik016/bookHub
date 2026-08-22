import { FolderOpen } from "lucide-react";
import Button from "./Button";

export default function EmptyState({ 
    icon: Icon = FolderOpen, 
    title = "Nothing to see here", 
    description = "We couldn't find any data matching your request.", 
    actionText, 
    onAction 
}) {
    return (
        <div className="flex w-full flex-col items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-gray-50 py-16 px-6 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-sm border border-gray-100">
                <Icon className="h-8 w-8 text-gray-400" />
            </div>
            
            <h3 className="mb-1 text-lg font-bold text-gray-900">{title}</h3>
            
            <p className="mb-6 max-w-sm text-sm text-gray-500">
                {description}
            </p>

            {actionText && onAction && (
                <Button onClick={onAction} className="px-6">
                    {actionText}
                </Button>
            )}
        </div>
    );
}