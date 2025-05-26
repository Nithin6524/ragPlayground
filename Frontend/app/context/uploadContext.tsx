"use client";

import { createContext, useContext, useState, ReactNode } from "react";

type UploadContextType = {
    isUploading: boolean;
    setIsUploading: (val: boolean) => void;
};

const UploadContext = createContext<UploadContextType | undefined>(undefined);

export const UploadProvider = ({ children }: { children: ReactNode }) => {
    const [isUploading, setIsUploading] = useState(false);

    return (
        <UploadContext.Provider value={{ isUploading, setIsUploading }}>
            {children}
        </UploadContext.Provider>
    );
};

export const useUpload = () => {
    const context = useContext(UploadContext);
    if (!context) {
        throw new Error("useUpload must be used within an UploadProvider");
    }
    return context;
};
