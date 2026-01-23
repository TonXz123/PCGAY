/**
 * แปลงไฟล์รูปภาพที่รับเข้ามาให้เป็นไฟล์ .webp เพื่อลดขนาดไฟล์
 * @param file ไฟล์ต้นฉบับที่ต้องการแปลง (File object)
 * @param quality คุณภาพของไฟล์ .webp ที่ต้องการ (0 ถึง 1, ค่าเริ่มต้นคือ 0.8)
 * @returns Promise ที่คืนค่าเป็น File object ของรูปภาพ .webp ใหม่
 */
export const convertImageToWebP = (file: File, quality: number = 0.8): Promise<File> => {
    return new Promise((resolve, reject) => {
        // Check if browser supports canvas and blob
        if (typeof window === "undefined" || !window.HTMLCanvasElement) {
            return reject(new Error("Browser does not support Canvas API"));
        }

        const reader = new FileReader();

        reader.onload = (event) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement("canvas");
                let width = img.width;
                let height = img.height;

                // Optional: Resize logic if needed (e.g. max width 1920)
                const MAX_WIDTH = 1920;
                if (width > MAX_WIDTH) {
                    height = Math.round((height * MAX_WIDTH) / width);
                    width = MAX_WIDTH;
                }

                canvas.width = width;
                canvas.height = height;

                const ctx = canvas.getContext("2d");
                if (!ctx) {
                    return reject(new Error("Could not get canvas context"));
                }

                // Draw image to canvas
                ctx.drawImage(img, 0, 0, width, height);

                // Export as WebP
                canvas.toBlob(
                    (blob) => {
                        if (blob) {
                            const newFileName = file.name.replace(/\.[^/.]+$/, "") + ".webp";
                            const newFile = new File([blob], newFileName, {
                                type: "image/webp",
                                lastModified: Date.now(),
                            });
                            resolve(newFile);
                        } else {
                            reject(new Error("Canvas to Blob conversion failed"));
                        }
                    },
                    "image/webp",
                    quality
                );
            };

            img.onerror = () => reject(new Error("Failed to load image"));
            if (event.target?.result) {
                img.src = event.target.result as string;
            }
        };

        reader.onerror = () => reject(new Error("Failed to read file"));
        reader.readAsDataURL(file);
    });
};
