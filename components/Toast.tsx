
import React, { useEffect, useState } from 'react';
import { useToast } from '../context/ToastContext';
import { CheckCircleIcon, XCircleIcon } from './icons';

const Toast: React.FC = () => {
    const { messages, removeToast } = useToast();

    return (
        <div className="fixed top-5 right-5 z-50 w-full max-w-sm">
            <div className="flex flex-col items-end space-y-2">
                {messages.map(toast => (
                    <ToastMessage key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />
                ))}
            </div>
        </div>
    );
};

interface ToastMessageProps {
    toast: { id: number; message: string; type: 'success' | 'error' };
    onClose: () => void;
}

const ToastMessage: React.FC<ToastMessageProps> = ({ toast, onClose }) => {
    const [isExiting, setIsExiting] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsExiting(true);
            const closeTimer = setTimeout(onClose, 300); // Wait for animation to finish
            return () => clearTimeout(closeTimer);
        }, 2700);

        return () => clearTimeout(timer);
    }, [onClose]);

    const isSuccess = toast.type === 'success';
    const bgColor = isSuccess ? 'bg-green-500' : 'bg-red-500';
    const Icon = isSuccess ? CheckCircleIcon : XCircleIcon;

    return (
        <div
            className={`flex items-center gap-3 p-3 text-white rounded-lg shadow-lg transform transition-all duration-300 ease-in-out ${bgColor} ${isExiting ? 'opacity-0 translate-x-full' : 'opacity-100 translate-x-0'}`}
        >
            <Icon />
            <span>{toast.message}</span>
        </div>
    );
};

export default Toast;
