const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL ||
  "https://qatra-backend-z5ej.onrender.com/api").replace(/\/$/, "");

const FIELD_NAMES = {
  name: "الاسم الكامل",
  email: "البريد الإلكتروني",
  phone: "رقم الهاتف",
  login: "البريد الإلكتروني أو رقم الهاتف",
  password: "كلمة المرور",
  password_confirmation: "تأكيد كلمة المرور",
  current_password: "كلمة المرور الحالية",
  national_id: "رقم الهوية",
  blood_type: "فصيلة الدم",
  country: "الدولة",
  region: "المحافظة",
  donation_areas: "مناطق التبرع",
  health_information: "المعلومات الصحية",
  availability_status: "حالة التوفر",
  terms_accepted: "الموافقة على الشروط",
  code: "رمز التحقق",
};

function translateValidationError(field, message = "") {
  const label = FIELD_NAMES[field] || "هذا الحقل";
  const text = message.toLowerCase();

  if (text.includes("required") && text.includes("accepted")) return "يجب الموافقة على الشروط والأحكام.";
  if (text.includes("required")) return `حقل ${label} مطلوب.`;
  if (text.includes("already been taken") || text.includes("unique")) return `${label} مستخدم مسبقًا.`;
  if (text.includes("confirmation does not match") || text.includes("confirmed")) return "كلمة المرور وتأكيدها غير متطابقين.";
  if (text.includes("valid email") || text.includes("email must be")) return "يرجى إدخال بريد إلكتروني صحيح.";
  if (text.includes("must be between")) {
    const numbers = message.match(/\d+/g);
    return numbers?.length >= 2
      ? `يجب أن يكون ${label} بين ${numbers[0]} و${numbers[1]} خانات.`
      : `طول ${label} غير مسموح.`;
  }
  if (text.includes("must be") && text.includes("digits")) {
    const number = message.match(/\d+/)?.[0];
    return number ? `يجب أن يتكون ${label} من ${number} أرقام.` : `يجب أن يحتوي ${label} على أرقام فقط.`;
  }
  if (text.includes("must be a number") || text.includes("numeric")) return `يجب أن يحتوي ${label} على أرقام فقط.`;
  if (text.includes("at least") || text.includes("minimum") || text.includes("min.string")) {
    const number = message.match(/\d+/)?.[0];
    return number ? `يجب ألا يقل ${label} عن ${number} خانات.` : `${label} أقصر من الحد المسموح.`;
  }
  if (text.includes("greater than") || text.includes("maximum") || text.includes("max.string")) {
    const number = message.match(/\d+/)?.[0];
    return number ? `يجب ألا يزيد ${label} عن ${number} خانة.` : `${label} أطول من الحد المسموح.`;
  }
  if (text.includes("must be a string")) return `يجب أن تكون قيمة ${label} نصًا صحيحًا.`;
  if (text.includes("must be an array")) return `يجب اختيار قيمة صحيحة لحقل ${label}.`;
  if (text.includes("must be true") || text.includes("accepted")) return "يجب الموافقة على الشروط والأحكام.";
  if (text.includes("selected") || text.includes("invalid")) return `القيمة المختارة في ${label} غير صالحة.`;
  if (text.includes("incorrect") || text.includes("invalid code")) return `${label} غير صحيح.`;
  if (text.includes("expired")) return `${label} منتهي الصلاحية، يرجى طلب رمز جديد.`;

  return `توجد مشكلة في حقل ${label}، يرجى التحقق منه.`;
}

function translateServerMessage(message = "", status) {
  if (/[\u0600-\u06ff]/.test(message)) return message;
  const text = message.toLowerCase();

  if (text.includes("credentials") || text.includes("unauthorized")) return "بيانات تسجيل الدخول غير صحيحة.";
  if (text.includes("not verified") || text.includes("verify your email")) return "يجب تفعيل البريد الإلكتروني أولًا.";
  if (text.includes("suspended")) return "هذا الحساب موقوف، يرجى التواصل مع الدعم.";
  if (text.includes("not found")) return "لم يتم العثور على الحساب المطلوب.";
  if (text.includes("invalid") && text.includes("code")) return "رمز التحقق غير صحيح.";
  if (text.includes("expired") && text.includes("code")) return "انتهت صلاحية رمز التحقق، يرجى طلب رمز جديد.";
  if (text.includes("too many") || status === 429) return "تم إرسال محاولات كثيرة، يرجى الانتظار قليلًا ثم المحاولة مجددًا.";
  if (status === 401) return "انتهت صلاحية الجلسة أو أن بيانات الدخول غير صحيحة.";
  if (status === 403) return "ليس لديك صلاحية لتنفيذ هذا الإجراء، أو أن الحساب غير مفعّل.";
  if (status === 404) return "الخدمة المطلوبة غير موجودة.";
  if (status >= 500) return "حدث خطأ في الخادم، يرجى المحاولة لاحقًا.";

  return "تعذر إكمال الطلب، يرجى مراجعة البيانات والمحاولة مجددًا.";
}

function getErrorMessage(payload, status) {
  if (payload?.errors) {
    return Object.entries(payload.errors)
      .flatMap(([field, messages]) => (Array.isArray(messages) ? messages : [messages])
        .map((message) => translateValidationError(field, message)))
      .filter(Boolean)
      .join(" ");
  }

  return translateServerMessage(payload?.message, status);
}

async function request(path, options = {}) {
  const token = localStorage.getItem("auth_token");
  const isFormData = typeof FormData !== "undefined" && options.body instanceof FormData;

  const headers = {
    Accept: "application/json",
    ...(isFormData ? {} : { "Content-Type": "application/json" }),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  let response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      ...options,
      headers,
    });
  } catch {
    throw new Error("تعذر الاتصال بالخادم. تحقق من الإنترنت أو حاول مرة أخرى بعد قليل.");
  }

  const contentType = response.headers.get("content-type") || "";
  const payload = contentType.includes("application/json") ? await response.json() : null;

  if (!response.ok) {
    const error = new Error(getErrorMessage(payload, response.status));
    error.status = response.status;
    error.data = payload;
    throw error;
  }

  return payload;
}

export const authApi = {
  registerDonor: (data) => request("/auth/register/donor", {
    method: "POST",
    body: JSON.stringify(data),
  }),
  verifyEmail: (email, code) => request("/auth/verify-email", {
    method: "POST",
    body: JSON.stringify({ email, code }),
  }),
  resendVerificationCode: (email) => request("/auth/resend-verification-code", {
    method: "POST",
    body: JSON.stringify({ email }),
  }),
  registerHealthInstitution: (formData) => request("/auth/register/health-institution", {
    method: "POST",
    body: formData,
  }),
  verifyHealthInstitution: (email, code) => request("/auth/verify-health-institution", {
    method: "POST",
    body: JSON.stringify({ email, code }),
  }),
  resendHealthInstitutionVerificationCode: (email) => request("/auth/resend-health-institution-verification-code", {
    method: "POST",
    body: JSON.stringify({ email }),
  }),
};