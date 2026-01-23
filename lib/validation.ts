/**
 * Validation helper functions สำหรับ input validation และ sanitization
 */

/**
 * ตรวจสอบ email format
 */
export function validateEmail(email: string): { valid: boolean; error?: string } {
    if (!email || typeof email !== "string") {
        return { valid: false, error: "อีเมลไม่ถูกต้อง" };
    }

    // Trim whitespace
    const trimmedEmail = email.trim().toLowerCase();

    // ตรวจสอบความยาว
    if (trimmedEmail.length === 0) {
        return { valid: false, error: "กรุณากรอกอีเมล" };
    }

    if (trimmedEmail.length > 254) {
        return { valid: false, error: "อีเมลยาวเกินไป" };
    }

    // ตรวจสอบ email format ด้วย regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
        return { valid: false, error: "รูปแบบอีเมลไม่ถูกต้อง" };
    }

    // ตรวจสอบว่าไม่มีอักขระพิเศษที่เป็นอันตราย
    const dangerousChars = /[<>\"'%;()&+]/;
    if (dangerousChars.test(trimmedEmail)) {
        return { valid: false, error: "อีเมลมีอักขระที่ไม่ถูกต้อง" };
    }

    return { valid: true };
}

/**
 * ตรวจสอบ password strength
 */
export function validatePassword(password: string): { valid: boolean; error?: string } {
    if (!password || typeof password !== "string") {
        return { valid: false, error: "รหัสผ่านไม่ถูกต้อง" };
    }

    // ตรวจสอบความยาวขั้นต่ำ
    if (password.length < 6) {
        return { valid: false, error: "รหัสผ่านต้องมีความยาวอย่างน้อย 6 ตัวอักษร" };
    }

    // ตรวจสอบความยาวสูงสุด (ป้องกัน DoS)
    if (password.length > 128) {
        return { valid: false, error: "รหัสผ่านยาวเกินไป" };
    }

    return { valid: true };
}

/**
 * Sanitize string input - ลบอักขระที่เป็นอันตราย
 */
export function sanitizeString(input: string, maxLength?: number): string {
    if (typeof input !== "string") {
        return "";
    }

    // Trim whitespace
    let sanitized = input.trim();

    // จำกัดความยาว
    if (maxLength && sanitized.length > maxLength) {
        sanitized = sanitized.substring(0, maxLength);
    }

    return sanitized;
}

/**
 * ตรวจสอบและ sanitize string input
 */
export function validateAndSanitizeString(
    input: unknown,
    fieldName: string,
    options?: {
        required?: boolean;
        maxLength?: number;
        minLength?: number;
    }
): { valid: boolean; value?: string; error?: string } {
    const { required = true, maxLength, minLength } = options || {};

    // ตรวจสอบว่ามีค่าหรือไม่
    if (required && (!input || (typeof input === "string" && input.trim().length === 0))) {
        return { valid: false, error: `กรุณากรอก${fieldName}` };
    }

    // ถ้าไม่ required และไม่มีค่า ให้ return valid
    if (!required && (!input || (typeof input === "string" && input.trim().length === 0))) {
        return { valid: true, value: "" };
    }

    // ตรวจสอบ type
    if (typeof input !== "string") {
        return { valid: false, error: `${fieldName}ไม่ถูกต้อง` };
    }

    // Sanitize
    let sanitized = sanitizeString(input, maxLength);

    // ตรวจสอบความยาวขั้นต่ำ
    if (minLength && sanitized.length < minLength) {
        return { valid: false, error: `${fieldName}ต้องมีความยาวอย่างน้อย ${minLength} ตัวอักษร` };
    }

    return { valid: true, value: sanitized };
}

/**
 * ตรวจสอบและแปลงเป็น number
 */
export function validateNumber(
    input: unknown,
    fieldName: string,
    options?: {
        required?: boolean;
        min?: number;
        max?: number;
    }
): { valid: boolean; value?: number; error?: string } {
    const { required = true, min, max } = options || {};

    // ตรวจสอบว่ามีค่าหรือไม่
    if (required && (input === null || input === undefined || input === "")) {
        return { valid: false, error: `กรุณากรอก${fieldName}` };
    }

    // ถ้าไม่ required และไม่มีค่า
    if (!required && (input === null || input === undefined || input === "")) {
        return { valid: true, value: undefined };
    }

    // แปลงเป็น number
    const num = typeof input === "string" ? parseFloat(input) : Number(input);

    // ตรวจสอบว่าเป็น number ที่ถูกต้อง
    if (isNaN(num) || !isFinite(num)) {
        return { valid: false, error: `${fieldName}ต้องเป็นตัวเลข` };
    }

    // ตรวจสอบค่าต่ำสุด
    if (min !== undefined && num < min) {
        return { valid: false, error: `${fieldName}ต้องมีค่าอย่างน้อย ${min}` };
    }

    // ตรวจสอบค่าสูงสุด
    if (max !== undefined && num > max) {
        return { valid: false, error: `${fieldName}ต้องมีค่าไม่เกิน ${max}` };
    }

    return { valid: true, value: num };
}

/**
 * ตรวจสอบและแปลงเป็น integer
 */
export function validateInteger(
    input: unknown,
    fieldName: string,
    options?: {
        required?: boolean;
        min?: number;
        max?: number;
    }
): { valid: boolean; value?: number; error?: string } {
    const result = validateNumber(input, fieldName, options);

    if (!result.valid || result.value === undefined) {
        return result;
    }

    // ตรวจสอบว่าเป็น integer
    if (!Number.isInteger(result.value)) {
        return { valid: false, error: `${fieldName}ต้องเป็นจำนวนเต็ม` };
    }

    return { valid: true, value: Math.floor(result.value) };
}

/**
 * ตรวจสอบ category ที่อนุญาต
 */
export function validateCategory(category: unknown): { valid: boolean; value?: string; error?: string } {
    const allowedCategories = [
        "CPU", "GPU", "RAM", "Mainboard", "Case", "Power",
        "cpu", "gpu", "mainboard", "ram", "storage", "psu", "case", "cooling", "monitor", "gaming-gear", "keyboard", "mouse"
    ];

    const stringResult = validateAndSanitizeString(category, "หมวดหมู่", { required: true });

    if (!stringResult.valid) {
        return stringResult;
    }

    if (!allowedCategories.includes(stringResult.value!)) {
        return { valid: false, error: `หมวดหมู่ไม่ถูกต้อง: ${stringResult.value}` };
    }

    return { valid: true, value: stringResult.value };
}