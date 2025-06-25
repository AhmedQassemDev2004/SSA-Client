import {useState} from "react";
import {Card} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {ImagePlus, X} from "lucide-react";
import {useToast} from "@/hooks/use-toast";
import {api} from "@/lib/api";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

// Remove trailing slash if present to avoid double slashes
const cleanApiBaseUrl = API_BASE_URL.endsWith('/') ? API_BASE_URL.slice(0, -1) : API_BASE_URL;

interface ImageUploaderProps {
    images: string[];
    onChange: (urls: string[]) => void;
    maxImages?: number;
}

export function ImageUploader({images, onChange, maxImages = 5}: ImageUploaderProps) {
    const {toast} = useToast();
    const [isUploading, setIsUploading] = useState(false);


    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Check if we've reached the maximum number of images
        if (images.length >= maxImages) {
            toast({
                title: 'Maximum images reached',
                description: `You can only upload up to ${maxImages} images`,
                variant: 'destructive',
            });
            return;
        }

        // Validate file type
        if (!file.type.startsWith('image/')) {
            toast({
                title: 'Invalid file type',
                description: 'Please upload an image file',
                variant: 'destructive',
            });
            return;
        }

        // Validate file size (5MB)
        if (file.size > 5 * 1024 * 1024) {
            toast({
                title: 'File too large',
                description: 'Image size should be less than 5MB',
                variant: 'destructive',
            });
            return;
        }

        setIsUploading(true);

        try {
            const formData = new FormData();
            formData.append('file', file);

            // Use the configured API instance with authentication
            const response = await api.post('/upload', formData, {
                headers: {
                    // Let the browser set the Content-Type with boundary for multipart/form-data
                    'Content-Type': 'multipart/form-data',
                },
            });

            // Add the new image URL to the existing array
            const newImageUrl = response.data.data.path;
            onChange([...images, newImageUrl]);

            toast({
                title: 'Success',
                description: 'Image uploaded successfully',
            });
        } catch (error) {
            console.error('Upload error:', error);
            toast({
                title: 'Upload failed',
                description: 'Only Images files allowed, Check the file extension.',
                variant: 'destructive',
            });
        } finally {
            setIsUploading(false);
        }
    };

    const removeImage = (index: number) => {
        const newImages = [...images];
        newImages.splice(index, 1);
        onChange(newImages);
    };

    console.log(images)

    return (
        <div className="space-y-2">
            {/* Display existing images */}
            {images.length > 0 && (
                <div className="grid grid-cols-4 md:grid-cols-5 gap-2">
                    {images.map((image, index) => {
                        // Handle different URL formats
                        let imageUrl = image;
                        if (!image.startsWith('http')) {
                            // If it's already a full path like /uploads/image.png, add the base URL
                            if (image.startsWith('/uploads/')) {
                                imageUrl = `${cleanApiBaseUrl}${image}`;
                            } else {
                                // If it's just a filename, assume it's in uploads
                                imageUrl = `${cleanApiBaseUrl}${image}`;
                            }
                        }
                        console.log(`Image ${index}:`, { original: image, constructed: imageUrl });
                        
                        return (
                        <Card key={index} className="relative aspect-video overflow-hidden group h-16">
                            <img
                                src={imageUrl}
                                alt={`Image ${index + 1}`}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                    console.error('Image failed to load:', imageUrl);
                                    e.currentTarget.style.display = 'none';
                                }}
                                onLoad={() => {
                                    console.log('Image loaded successfully:', imageUrl);
                                }}
                            />
                            <div
                                className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <Button
                                    variant="destructive"
                                    size="icon"
                                    className="absolute top-1 right-1 h-5 w-5"
                                    onClick={() => removeImage(index)}
                                >
                                    <X className="h-3 w-3"/>
                                </Button>
                            </div>
                        </Card>
                        );
                    })}
                </div>
            )}

            {/* Upload new image button */}
            {images.length < maxImages && (
                <Card className="relative overflow-hidden h-16">
                    <label
                        className="flex flex-row items-center justify-center h-full cursor-pointer gap-2 text-muted-foreground hover:text-foreground transition-colors px-4">
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleUpload}
                            className="hidden"
                            disabled={isUploading}
                        />
                        <ImagePlus className="h-5 w-5"/>
                        <span className="text-xs font-medium">
              {isUploading ? "Uploading..." : "Upload Image"}
            </span>
                    </label>
                </Card>
            )}

            {/* Display message when max images reached */}
            {images.length >= maxImages && (
                <p className="text-xs text-muted-foreground text-center">
                    Maximum of {maxImages} images reached
                </p>
            )}
        </div>
    );
}
