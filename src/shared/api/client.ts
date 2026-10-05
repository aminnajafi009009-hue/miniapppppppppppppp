import WebApp from "@twa-dev/sdk"

// آدرس بک‌اند Flask (webapp_api.py). موقع دیپلوی، این مقدار را در فایل .env
// به‌صورت VITE_API_BASE_URL تنظیم کنید (مثلا https://api.yourdomain.com).
const BASE_URL = import.meta.env.VITE_API_BASE_URL || (typeof window !== "undefined" ? window.location.origin : "")

export class ApiError extends Error {
    status: number
    code?: string
    constructor(status: number, message: string, code?: string) {
        super(message)
        this.status = status
        this.code = code
    }
}

function authHeader(): Record<string, string> {
    // initData همان چیزی است که بک‌اند برای اعتبارسنجی HMAC استفاده می‌کند؛
    // این تنها منبع هویت کاربر است، نه چیزی که ما دستی بسازیم.
    const initData = WebApp.initData || ""
    return initData ? { Authorization: `tma ${initData}` } : {}
}

async function handleResponse(res: Response) {
    let body: any = null
    try {
        body = await res.json()
    } catch {
        // بدنه‌ی خالی یا غیر JSON (مثلا دانلود فایل)
    }
    if (!res.ok) {
        throw new ApiError(res.status, body?.error || `HTTP ${res.status}`, body?.error)
    }
    return body
}

// 🐛 فیکس: قبلاً وقتی شبکه درخواست رو اصلاً به سرور نمی‌رسوند (مثلاً چون
// VITE_API_BASE_URL موقع build تنظیم نشده و روی localhost مونده، یا اینکه CORS به
// خاطر عدم تطابق MINIAPP_ORIGIN بسته می‌شه)، مرورگر یک خطای کاملاً مبهم
// مثل "Failed to fetch" می‌دهد و هیچ سرنخی از اینکه دقیقاً کدام URL را زده
// نمی‌دهد. اینجا آن را می‌گیریم و یک پیام واضح‌تر می‌سازیم که آدرس دقیق رو
// نشون می‌دهد (فقط در متن خطا، نه توی رابط کاربر)، تا دیباگ رفع مشکل
// فوری مشخص بشود که دقیقاً کجای کد دارد مشکل.
async function fetchWithContext(url: string, init: RequestInit) {
    try {
        return await fetch(url, init)
    } catch (err) {
        const reason = err instanceof Error ? err.message : String(err)
        throw new Error(`${reason} (آدرس مقصد: ${url})`)
    }
}

export async function apiGet(path: string) {
    const res = await fetchWithContext(`${BASE_URL}${path}`, {
        method: "GET",
        headers: { ...authHeader() },
    })
    return handleResponse(res)
}

export async function apiPost(path: string, body?: unknown) {
    const res = await fetchWithContext(`${BASE_URL}${path}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...authHeader() },
        body: body !== undefined ? JSON.stringify(body) : undefined,
    })
    return handleResponse(res)
}

export async function apiPostForm(path: string, form: FormData) {
    const res = await fetchWithContext(`${BASE_URL}${path}`, {
        method: "POST",
        headers: { ...authHeader() },
        body: form,
    })
    return handleResponse(res)
}

/** برای دانلود فایل (کیوآرکد / فایل کانفیگ گیمینگ) به‌صورت Blob با هدر احراز هویت. */
export async function apiGetBlob(path: string): Promise<Blob> {
    const res = await fetch(`${BASE_URL}${path}`, {
        method: "GET",
        headers: { ...authHeader() },
    })
    if (!res.ok) {
        throw new ApiError(res.status, `HTTP ${res.status}`)
    }
    return res.blob()
}

// نگاشت کد خطاهای بک‌اند به پیام قابل‌فهم برای کاربر فارسی‌زبان.
// وقتی بک‌اند کد جدیدی برمی‌گرداند که اینجا نیست، از fallback خود همان
// صفحه (یا پیام پیش‌فرض) استفاده می‌شود، نه یک پیام مبهم یکسان برای همه.
export const ERROR_CODE_MESSAGES: Record<string, string> = {
    invoice_expired:
        "⏰ مهلت ۳۰ دقیقه‌ای این فاکتور به پایان رسیده و به‌طور خودکار منقضی شد. لطفاً دوباره سفارش را ثبت کنید.",
    orders_closed: "بخش سفارشات موقتاً بسته است.",
    insufficient_balance: "موجودی کیف پول کافی نیست.",
    invalid_file_type: "فرمت فایل رسید نامعتبر است؛ لطفاً یک تصویر انتخاب کنید.",
    invalid_request: "درخواست نامعتبر است؛ لطفاً دوباره تلاش کنید.",
    telegram_delivery_failed: "ارسال رسید به ادمین موقتاً با خطا مواجه شد؛ لطفاً چند لحظه دیگر دوباره تلاش کنید.",
    free_test_already_used: "شما قبلاً از تست رایگان استفاده کرده‌اید.",
    plan_not_found: "این پلن دیگر در دسترس نیست.",
    gateway_disabled: "درگاه پرداخت آنلاین موقتاً غیرفعال است.",
    gateway_error: "ارتباط با درگاه پرداخت ��ا خطا مواجه شد؛ لطفاً دوباره تلاش کنید.",
    not_found: "موردی یافت نشد.",
    forbidden: "دسترسی مجاز نیست.",
}

/** پیام دوستانه‌ی متناظر با خطای بک‌اند؛ اگر کد شناخته‌شده نبود، fallback داده‌شده نمایش داده می‌شود. */
export function friendlyErrorMessage(e: unknown, fallback: string): string {
    if (e instanceof ApiError && e.code && ERROR_CODE_MESSAGES[e.code]) {
        return ERROR_CODE_MESSAGES[e.code]
    }
    return fallback
}

export { BASE_URL }
