import * as faceapi from 'face-api.js';
import { supabase } from "@/utils/supabase/client";
import { AuthService } from "./auth.service";
import { toast } from "sonner";

export interface FaceVerificationResult {
    verified: boolean;
    similarity: number;
    message?: string;
}

let modelsLoaded = false;

export const FaceRecognitionService = {
    async loadModels() {
        if (modelsLoaded) return;
        try {
            const MODEL_URL = '/models';
            await Promise.all([
                faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL),
                faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
                faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL)
            ]);
            modelsLoaded = true;
        } catch (error) {
            console.error("Error loading face-api models:", error);
            throw new Error("Failed to load facial recognition models");
        }
    },

    async getDescriptorFromBlob(blob: Blob): Promise<Float32Array | null> {
        await this.loadModels();
        const url = URL.createObjectURL(blob);
        try {
            const img = await faceapi.fetchImage(url);
            console.log("Image fetched for face detection, size:", blob.size);

            const detection = await faceapi.detectSingleFace(img)
                .withFaceLandmarks()
                .withFaceDescriptor();

            if (!detection) {
                console.warn("Face detection failed: No face found in the image.");
            } else {
                console.log("Face detected with confidence:", (detection as any).detection?.score || 'N/A');
            }

            return detection ? detection.descriptor : null;
        } finally {
            URL.revokeObjectURL(url);
        }
    },

    async enrollFace(imageBlob: Blob): Promise<boolean> {
        try {
            const descriptor = await this.getDescriptorFromBlob(imageBlob);
            if (!descriptor) {
                toast.error("No face detected. Please try again with better lighting.");
                return false;
            }

            const user = await AuthService.getCurrentUser();
            if (!user) throw new Error("User not authenticated");

            // Convert Float32Array to regular array for JSONB storage
            const descriptorArray = Array.from(descriptor);

            const { error } = await supabase
                .from('profiles')
                .upsert({
                    id: user.id,
                    face_descriptor: descriptorArray,
                    has_face_id: true,
                    updated_at: new Date().toISOString()
                } as any)
                .eq('id', user.id);

            if (error) throw error;

            toast.success("Face ID enrolled successfully!");
            return true;
        } catch (error: any) {
            console.error('Face enrollment error:', error);
            toast.error(error.message || "Failed to enroll face");
            return false;
        }
    },

    async verifyFace(imageBlob: Blob): Promise<FaceVerificationResult> {
        try {
            const currentDescriptor = await this.getDescriptorFromBlob(imageBlob);
            if (!currentDescriptor) {
                return { verified: false, similarity: 0, message: "No face detected in capture." };
            }

            const user = await AuthService.getCurrentUser();
            if (!user) throw new Error("User not authenticated");

            // Fetch stored descriptor
            const { data, error } = await supabase
                .from('profiles')
                .select('face_descriptor')
                .eq('id', user.id)
                .single();

            if (error || !data?.face_descriptor) {
                throw new Error("Face ID not set up for this user.");
            }

            const storedDescriptor = new Float32Array(data.face_descriptor);

            // Calculate Euclidean Distance
            const distance = faceapi.euclideanDistance(currentDescriptor, storedDescriptor);

            // Lower distance = higher similarity. 
            // Standard is 0.6. Changed to 0.8 to be much more lenient (requires approx 20% similarity).
            const threshold = 0.8;
            const verified = distance < threshold;
            const similarity = Math.max(0, (1 - distance) * 100);

            return {
                verified,
                similarity,
                message: verified ? "Face verified successfully" : "Face does not match registered profile",
            };
        } catch (error: any) {
            console.error('Face verification error:', error);
            return { verified: false, similarity: 0, message: error.message };
        }
    }
};
