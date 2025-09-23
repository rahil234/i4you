'use client';
import {Upload, X} from 'lucide-react';
import {OnboardingLayout} from '@/components/onboarding-layout';
import {useOnboardingStore} from '@/store/onboarding-store';
import mediaService from '@/services/media.service';

export default function OnboardingPhotos() {
    const {data, addPhoto, removePhoto} = useOnboardingStore();
    const photos = data.photos;

    const uploadPhoto = async (file: File) => {
        try {
            const {data, error} = await mediaService.getUploadUrl(file);
            if (error) throw new Error('Failed to get upload URL');

            console.log('upload url data', data)

            const {url, fields} = data;

            const {data: uploaded, error: uploadImageError} = await mediaService.uploadImage(file, url, fields);
            if (uploadImageError) {
                console.error('Error uploading image:', uploadImageError);
                return;
            }

            const imageUrl = uploaded.secure_url;
            addPhoto(imageUrl);
        } catch (error) {
            console.error('Error uploading photo:', error);
        }
    };

    const handleAddPhoto = async () => {
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = 'image/*';
        fileInput.onchange = async () => {
            if (fileInput.files && fileInput.files[0]) {
                const file = fileInput.files[0];
                await uploadPhoto(file);
            }
        };
        fileInput.click();
    };

    return (
        <OnboardingLayout currentStep="photos">
            <div className="w-full max-w-md mx-auto">
                <h1 className="text-3xl font-bold mb-2">Add your photos</h1>
                <p className="text-muted-foreground mb-6">
                    Add at least 2 photos to continue. Profiles with photos get more matches!
                </p>

                <div className="grid grid-cols-3 gap-2 mb-8">
                    {photos.map((photo, index) => (
                        <div key={index} className="aspect-square rounded-lg relative group">
                            <img
                                src={photo || '/placeholder.svg'}
                                alt={`Profile photo ${index + 1}`}
                                className="w-full h-full object-cover rounded-lg group-hover:opacity-75 transition-opacity"
                            />
                            <button
                                onClick={() => removePhoto(index)}
                                className="absolute size-5 -top-1 -right-1 bg-red-500 rounded-full opacity-0 p-1 group-hover:opacity-100 transition flex items-center justify-center"
                                aria-label="Delete photo"
                            >
                                <X/>
                            </button>
                        </div>
                    ))}

                    {photos.length < 6 && (
                        <button
                            onClick={handleAddPhoto}
                            className="aspect-square rounded-lg border-2 border-dashed border-muted-foreground/50 flex items-center justify-center hover:bg-muted/50 transition-colors"
                        >
                            <Upload className="h-6 w-6 text-muted-foreground"/>
                        </button>
                    )}
                </div>
            </div>
        </OnboardingLayout>
    );
}
