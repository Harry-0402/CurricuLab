import React, { useRef, useState, useEffect } from 'react';
import { Icons } from '@/components/shared/Icons';
import { Button } from '@/components/shared/Button';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface FaceVerificationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onCapture: (imageBlob: Blob) => void;
    title?: string;
    description?: string;
    isProcessing?: boolean;
}

export function FaceVerificationModal({
    isOpen,
    onClose,
    onCapture,
    title = "Verify Identity",
    description = "Position your face in the center of the frame.",
    isProcessing = false
}: FaceVerificationModalProps) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [stream, setStream] = useState<MediaStream | null>(null);
    const [capturedImage, setCapturedImage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (isOpen) {
            startCamera();
            // Pre-load models for faster capture response
            import('@/lib/services/face-recognition-service').then(({ FaceRecognitionService }) => {
                FaceRecognitionService.loadModels().catch(console.error);
            });
        } else {
            stopCamera();
            setCapturedImage(null);
            setError(null);
        }
        return () => stopCamera();
    }, [isOpen]);

    const startCamera = async () => {
        try {
            const mediaStream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: 'user' }
            });
            setStream(mediaStream);
            if (videoRef.current) {
                videoRef.current.srcObject = mediaStream;
            }
            setError(null);
        } catch (err: any) {
            console.error("Camera error:", err);
            setError("Unable to access camera. Please allow camera permissions.");
        }
    };

    const stopCamera = () => {
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
            setStream(null);
        }
    };

    const handleCapture = () => {
        if (videoRef.current && canvasRef.current) {
            const context = canvasRef.current.getContext('2d');
            if (context) {
                // Set canvas dimensions to match video
                canvasRef.current.width = videoRef.current.videoWidth;
                canvasRef.current.height = videoRef.current.videoHeight;

                // Draw video frame to canvas
                context.drawImage(videoRef.current, 0, 0, videoRef.current.videoWidth, videoRef.current.videoHeight);

                // Convert to data URL for preview
                const dataUrl = canvasRef.current.toDataURL('image/jpeg');
                setCapturedImage(dataUrl);

                // Stop camera stream to freeze/save resources
                // stopCamera(); // Optional: keep running or stop? Let's stop.
            }
        }
    };

    const handleConfirm = () => {
        if (canvasRef.current) {
            canvasRef.current.toBlob((blob) => {
                if (blob) {
                    onCapture(blob);
                }
            }, 'image/jpeg', 0.95);
        }
    };

    const handleRetake = () => {
        setCapturedImage(null);
        // Restart camera if it was stopped
        if (!stream) {
            startCamera();
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-3xl p-6 w-full max-w-md mx-4 shadow-2xl relative">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-900 transition-colors"
                >
                    <Icons.X size={24} />
                </button>

                <div className="text-center mb-6">
                    <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-3">
                        <Icons.Camera size={24} />
                    </div>
                    <h3 className="text-xl font-black text-gray-900">{title}</h3>
                    <p className="text-gray-500 text-sm font-medium mt-1">{description}</p>
                </div>

                <div className="relative aspect-[3/4] bg-black rounded-2xl overflow-hidden mb-6 shadow-inner">
                    {error ? (
                        <div className="absolute inset-0 flex items-center justify-center text-white p-6 text-center">
                            <p>{error}</p>
                        </div>
                    ) : (
                        <>
                            {!capturedImage ? (
                                <video
                                    ref={videoRef}
                                    autoPlay
                                    playsInline
                                    muted
                                    className="w-full h-full object-cover transform scale-x-[-1]" // Mirror effect
                                />
                            ) : (
                                <img
                                    src={capturedImage}
                                    alt="Captured"
                                    className="w-full h-full object-cover"
                                />
                            )}

                            {/* Face Overlay Guide */}
                            {!capturedImage && (
                                <div className="absolute inset-0 border-[3px] border-white/30 rounded-[50%] w-48 h-64 m-auto pointer-events-none" />
                            )}

                            {/* Processing Overlay */}
                            {isProcessing && (
                                <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center z-10">
                                    <div className="w-10 h-10 border-4 border-white/20 border-t-white rounded-full animate-spin mb-2" />
                                    <p className="text-white font-bold text-sm">Verifying...</p>
                                </div>
                            )}
                        </>
                    )}
                </div>

                {/* Hidden Canvas */}
                <canvas ref={canvasRef} className="hidden" />

                <div className="flex gap-3">
                    {!capturedImage ? (
                        <Button
                            onClick={handleCapture}
                            disabled={!!error || isProcessing}
                            className="w-full rounded-xl h-12 text-base"
                        >
                            Capture Photo
                        </Button>
                    ) : (
                        <>
                            <Button
                                onClick={handleRetake}
                                variant="outline"
                                disabled={isProcessing}
                                className="flex-1 rounded-xl h-12 border-gray-200"
                            >
                                Retake
                            </Button>
                            <Button
                                onClick={handleConfirm}
                                disabled={isProcessing}
                                className="flex-1 rounded-xl h-12"
                            >
                                {isProcessing ? "Processing..." : "Use Photo"}
                            </Button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
