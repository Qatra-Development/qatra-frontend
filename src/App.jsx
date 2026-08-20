import React, { useState, useEffect, useRef } from "react";
import {
  Droplet,
  HeartPulse,
  ChevronLeft,
  Check,
  Lock,
  Eye,
  EyeOff,
  ChevronDown,
  ArrowLeft,
  HeartHandshake,
  MailCheck,
  Building2,
  UserCheck,
  Stethoscope,
  Upload,
  FileText,
  Store,
  Info,
} from "lucide-react";
import logoImage from "./assets/logo.png";
import { authApi } from "./api";
import "./App.css";

// القيم لازم تطابق بالضبط ما يقبله الـ Backend في institution_type
const INSTITUTION_TYPES = [
  { value: "central_hospital", label: "مستشفى مركزي" },
  { value: "field_hospital", label: "مستشفى ميداني" },
  { value: "health_center", label: "مركز صحي" },
  { value: "blood_bank_association", label: "جمعية بنك دم" },
  { value: "independent_blood_center", label: "مركز دم مستقل" },
];

const ACCOUNT_TYPES = [
  {
    id: "donor",
    title: "متبرع بالدم",
    description: "انضم لمجتمع المتبرعين وساهم في إنقاذ الأرواح",
    Icon: Droplet,
    accent: "#af101a",
  },
  {
    id: "institution",
    title: "جهة طبية / مستشفى",
    description: "إدارة طلبات الدم وتنسيق الحملات",
    Icon: HeartPulse,
    accent: "#005faf",
  },
];

const BLOOD_TYPES = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

// تحويل قيم واجهة نطاق الخدمة (المستخدمة داخليًا للعرض الشرطي) إلى القيم
// اللي يتوقعها الـ Backend فعليًا في حقل service_scope
const BACKEND_SERVICE_SCOPE_MAP = {
  blood_request_only: "blood_request_only",
  blood_bank_only: "blood_bank_services_only",
  both: "blood_request_and_blood_bank",
};

const GOVERNORATES = [
  { value: "North Gaza", label: "شمال غزة" },
  { value: "Gaza City", label: "غزة" },
  { value: "Deir al-Balah", label: "دير البلح" },
  { value: "Khan Yunis", label: "خان يونس" },
  { value: "Rafah", label: "رفح" },
];

const EMPTY_DONOR_FORM = {
  fullName: "", nationalId: "", email: "", phone: "", password: "", confirmPassword: "", bloodType: "", governorate: "", terms: false,
};

function AppHeader({ onBack }) {
  return (
    <header className="header">
      <div className="header-inner">
        <a href="#" className="logo">
          Qatra
        </a>
        {onBack ? (
          <button className="login-btn" onClick={onBack}>
            رجوع
          </button>
        ) : (
          <button className="login-btn">تسجيل الدخول</button>
        )}
      </div>
    </header>
  );
}
function LoginPage({ onCreateAccount, onLoginSuccess }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      setError("يرجى إدخال البريد الإلكتروني وكلمة المرور.");
      return;
    }

    setError("");
    setIsLoading(true);

    try {
      const res = await authApi.login({ login: email.trim(), password });
      if (onLoginSuccess) {
        onLoginSuccess(res);
      } else {
        alert("تم تسجيل الدخول بنجاح!");
      }
    } catch (err) {
      setError(err.message || "فشل تسجيل الدخول، يرجى التأكد من صحة البيانات والمحاولة مجدداً.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div dir="rtl" lang="ar" className="qatra-app">
      <header className="header">
        <div className="header-inner">
          <a href="#" className="logo" onClick={(event) => event.preventDefault()}>Qatra</a>
          <button type="button" className="login-btn" onClick={onCreateAccount}>تسجيل جديد</button>
        </div>
      </header>

      <main className="main">
        <div className="main-inner">
          <div className="split-form login-form-side">
            <div className="split-form-inner">
              <div className="logo-badge-wrap">
                <div className="logo-badge login-logo-badge">
                  <img src={logoImage} alt="شعار قطرة" className="logo-image" />
                </div>
              </div>

              <div className="split-form-header login-heading">
                <h1 className="form-title login-title">تسجيل الدخول</h1>
                <p className="form-subtitle">مرحباً بك مجدداً في منصة قطرة. سجل دخولك للمتابعة.</p>
              </div>

              <form className="donor-form" onSubmit={handleSubmit} noValidate>
                {error && <div className="form-error-banner">{error}</div>}

                <div className="form-field">
                  <label className="form-label" htmlFor="loginEmail">البريد الإلكتروني</label>
                  <input
                    id="loginEmail"
                    type="email"
                    dir="ltr"
                    className="form-input"
                    placeholder="example@mail.com"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isLoading}
                    required
                  />
                </div>

                <div className="form-field">
                  <label className="form-label" htmlFor="loginPassword">كلمة المرور</label>
                  <div className="form-input-icon-wrap">
                    <input
                      id="loginPassword"
                      type={showPassword ? "text" : "password"}
                      dir="ltr"
                      className="form-input"
                      placeholder="••••••••"
                      autoComplete="current-password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={isLoading}
                      required
                    />
                    <button
                      type="button"
                      className="form-input-icon-btn"
                      onClick={() => setShowPassword((visible) => !visible)}
                      aria-label={showPassword ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <button type="button" className="forgot-password-btn">نسيت كلمة المرور؟</button>
                <button type="submit" className="form-submit-btn" disabled={isLoading}>
                  <span>{isLoading ? "جاري تسجيل الدخول..." : "تسجيل الدخول"}</span>
                </button>
              </form>

              <p className="form-footer-text">
                ليس لديك حساب؟{" "}
                <button type="button" className="form-footer-link" onClick={onCreateAccount}>
                  إنشاء حساب جديد
                </button>
              </p>
            </div>
          </div>

          <div className="hero-area">
            <div className="hero-bg" />
            <div className="hero-content login-hero-content">
              <h2 className="hero-title">شارك الحياة، فليس أثمن من الدم هدية</h2>
              <div className="impact-panel login-impact-panel">
                <div className="impact-panel-top">
                  <div className="impact-panel-icon"><Droplet size={26} color="#ffffff" /></div>
                  <div className="impact-panel-text">
                    <div className="impact-panel-count">1,500+</div>
                    <div className="impact-panel-label">متبرع انضموا إلينا هذا الشهر</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function DonorRegistrationPage({ onBack, onLogin, onSubmitSuccess }) {
  const [form, setForm] = useState(EMPTY_DONOR_FORM);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const updateField = (field) => (e) => {
    let value = field === "terms" ? e.target.checked : e.target.value;

    if (field === "nationalId") {
      value = value.replace(/\D/g, "");
    }

    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const requiredFilled =
      form.fullName.trim() &&
      form.nationalId.trim() &&
      form.email.trim() &&
      form.phone.trim() &&
      form.password &&
      form.confirmPassword &&
      form.bloodType &&
      form.governorate;

    if (!requiredFilled || !form.terms) {
      setError(
        "يرجى إكمال جميع بيانات المتبرع المطلوبة والموافقة على شروط الخدمة قبل المتابعة."
      );
      return;
    }

    if (!/^\d{9,}$/.test(form.nationalId.trim())) {
      setError("يرجى إدخال رقم هوية صحيح مكون من 9 أرقام على الأقل.");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError("كلمة المرور وتأكيدها غير متطابقتين، يرجى المحاولة مجدداً.");
      return;
    }

    setError("");
    setIsLoading(true);

    try {
      await authApi.registerDonor({
        name: form.fullName.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        password: form.password,
        password_confirmation: form.confirmPassword,
        national_id: form.nationalId.trim(),
        blood_type: form.bloodType,
        country: "Palestine",
        region: form.governorate,
        donation_areas: [form.governorate],
        availability_status: "available",
        terms_accepted: form.terms,
      });
      onSubmitSuccess(form.email);
    } catch (err) {
      setError(err.message || "حدث خطأ أثناء الاتصال بالخادم، يرجى المحاولة لاحقاً.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div dir="rtl" lang="ar" className="qatra-app">
      <AppHeader onBack={onBack} />

      <main className="main">
        <div className="split-layout">
          <div className="split-form">
            <div className="split-form-inner">
              <div className="split-form-header">
                <div className="split-form-brand">
                  <Droplet size={30} strokeWidth={2} className="split-form-brand-icon" />
                  <span className="split-form-brand-name">Qatra</span>
                </div>
                <h1 className="form-title">تسجيل متبرع جديد</h1>
                <p className="form-subtitle">
                  انضم إلى مجتمع قطرة وساهم في إنقاذ حياة.
                </p>
              </div>

              <form className="donor-form" onSubmit={handleSubmit} noValidate>
                {error && <div className="form-error-banner">{error}</div>}

                <div className="form-field">
                  <label className="form-label" htmlFor="fullName">
                    الاسم الكامل
                  </label>
                  <input
                    id="fullName"
                    type="text"
                    className="form-input"
                    placeholder="أدخل اسمك الكامل"
                    value={form.fullName}
                    onChange={updateField("fullName")}
                    disabled={isLoading}
                  />
                </div>

                <div className="form-field">
                  <label className="form-label" htmlFor="nationalId">
                    رقم الهوية
                  </label>
                  <input
                    id="nationalId"
                    type="text"
                    inputMode="numeric"
                    className="form-input"
                    placeholder="أدخل رقم الهوية"
                    value={form.nationalId}
                    onChange={updateField("nationalId")}
                    disabled={isLoading}
                  />
                </div>

                <div className="form-row">
                  <div className="form-field">
                    <label className="form-label" htmlFor="email">
                      البريد الإلكتروني
                    </label>
                    <input
                      id="email"
                      type="email"
                      dir="ltr"
                      className="form-input"
                      placeholder="name@example.com"
                      value={form.email}
                      onChange={updateField("email")}
                      disabled={isLoading}
                    />
                  </div>
                  <div className="form-field">
                    <label className="form-label" htmlFor="phone">
                      رقم الهاتف
                    </label>
                    <input
                      id="phone"
                      type="tel"
                      dir="ltr"
                      className="form-input"
                      placeholder="05X XXX XXXX"
                      value={form.phone}
                      onChange={updateField("phone")}
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-field">
                    <label className="form-label" htmlFor="password">
                      كلمة المرور
                    </label>
                    <div className="form-input-icon-wrap">
                      <input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        dir="ltr"
                        className="form-input"
                        placeholder="••••••••"
                        value={form.password}
                        onChange={updateField("password")}
                        disabled={isLoading}
                      />
                      <button
                        type="button"
                        className="form-input-icon-btn"
                        onClick={() => setShowPassword((v) => !v)}
                        aria-label="إظهار كلمة المرور"
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>
                  <div className="form-field">
                    <label className="form-label" htmlFor="confirmPassword">
                      تأكيد كلمة المرور
                    </label>
                    <input
                      id="confirmPassword"
                      type="password"
                      dir="ltr"
                      className="form-input"
                      placeholder="••••••••"
                      value={form.confirmPassword}
                      onChange={updateField("confirmPassword")}
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-field">
                    <label className="form-label" htmlFor="bloodType">
                      فصيلة الدم
                    </label>
                    <div className="form-select-wrap">
                      <select
                        id="bloodType"
                        dir="ltr"
                        className="form-input form-select"
                        value={form.bloodType}
                        onChange={updateField("bloodType")}
                        disabled={isLoading}
                      >
                        <option value="" disabled hidden>
                          اختر الفصيلة
                        </option>
                        {BLOOD_TYPES.map((bt) => (
                          <option key={bt} value={bt}>
                            {bt}
                          </option>
                        ))}
                      </select>
                      <ChevronDown size={18} className="form-select-icon" />
                    </div>
                  </div>
                  <div className="form-field">
                    <label className="form-label" htmlFor="governorate">
                      المحافظة
                    </label>
                    <div className="form-select-wrap">
                      <select
                        id="governorate"
                        className="form-input form-select"
                        value={form.governorate}
                        onChange={updateField("governorate")}
                        disabled={isLoading}
                      >
                        <option value="" disabled hidden>
                          اختر المحافظة
                        </option>
                        {GOVERNORATES.map((g) => (
                          <option key={g.value} value={g.value}>
                            {g.label}
                          </option>
                        ))}
                      </select>
                      <ChevronDown size={18} className="form-select-icon" />
                    </div>
                  </div>
                </div>

                <label className="form-checkbox-row" htmlFor="terms">
                  <input
                    id="terms"
                    type="checkbox"
                    className="form-checkbox"
                    checked={form.terms}
                    onChange={updateField("terms")}
                    disabled={isLoading}
                  />
                  <span className="form-checkbox-label">
                    أوافق على <a href="#">شروط الخدمة</a> و{" "}
                    <a href="#">سياسة الخصوصية</a>.
                  </span>
                </label>

                <button type="submit" className="form-submit-btn" disabled={isLoading}>
                  <span>{isLoading ? "جاري إنشاء الحساب..." : "إنشاء حساب"}</span>
                  {!isLoading && <ArrowLeft size={20} />}
                </button>
              </form>

              <p className="form-footer-text">
                لديك حساب بالفعل؟{" "}
                <button type="button" className="form-footer-link" onClick={onLogin}>
                  تسجيل الدخول
                </button>
              </p>
            </div>
          </div>

          <div className="split-hero">
            <div className="split-hero-glow split-hero-glow-a" />
            <div className="split-hero-glow split-hero-glow-b" />
            <div className="split-hero-content">
              <div className="impact-panel">
                <div className="impact-panel-top">
                  <div className="impact-panel-icon">
                    <HeartHandshake size={26} color="#ffffff" />
                  </div>
                  <div className="impact-panel-text">
                    <div className="impact-panel-label">مجتمع المتبرعين</div>
                    <div className="impact-panel-count">1,500</div>
                  </div>
                </div>
                <div className="impact-panel-bar">
                  <div className="impact-panel-bar-fill" />
                </div>
                <div className="impact-panel-bottom">
                  <span>متبرع نشط</span>
                  <span>الهدف: 2,000</span>
                </div>
              </div>

              <h2 className="split-hero-title">
                بدمك، يُشرق
                <br />
                <span className="split-hero-title-accent">أمل جديد</span>
              </h2>
              <p className="split-hero-text">
                قطرة دم واحدة منك قد تكون هي الفاصل بين الحياة والموت. انضم إلى
                الآلاف من الأبطال الخفيين في مجتمع قطرة.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function EmailVerificationPage({ email, accountType = "donor", onBack, onVerified }) {
  const [digits, setDigits] = useState(["", "", "", ""]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [redirectCountdown, setRedirectCountdown] = useState(5);
  const [timer, setTimer] = useState(60);
  const inputsRef = useRef([]);

  // عداد تنازلي لإعادة إرسال الرمز
  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => setTimer((t) => t - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  useEffect(() => {
    if (!isVerified) return;

    const interval = window.setInterval(() => {
      setRedirectCountdown((seconds) => {
        if (seconds <= 1) {
          window.clearInterval(interval);
          onVerified();
          return 0;
        }
        return seconds - 1;
      });
    }, 1000);

    return () => window.clearInterval(interval);
  }, [isVerified, onVerified]);

  const handleChange = (index) => (e) => {
    const value = e.target.value.replace(/[^0-9]/g, "").slice(0, 1);
    setDigits((prev) => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
    if (value && index < digits.length - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index) => (e) => {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handleVerify = async () => {
    const otpCode = digits.join("");
    if (digits.some((d) => d === "")) {
      setError("يرجى إدخال رمز التحقق المكون من 4 أرقام كاملاً.");
      return;
    }

    setError("");
    setIsLoading(true);

    try {
      if (accountType === "institution") {
        await authApi.verifyHealthInstitution(email, otpCode);
      } else {
        await authApi.verifyEmail(email, otpCode);
      }
      setIsVerified(true);
    } catch (err) {
      setError(err.message || "فشل التحقق من الرمز، يرجى المحاولة مجدداً.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (timer > 0) return;
    setError("");
    try {
      if (accountType === "institution") {
        await authApi.resendHealthInstitutionVerificationCode(email);
      } else {
        await authApi.resendVerificationCode(email);
      }
      setTimer(60);
      alert("تم إرسال رمز جديد إلى بريدك الإلكتروني.");
    } catch {
      setError("فشل إعادة إرسال الرمز.");
    }
  };

  return (
    <div dir="rtl" lang="ar" className="qatra-app">
      {isVerified && (
        <div className="success-modal-backdrop" role="status" aria-live="polite">
          <div className="success-modal">
            <div className="success-modal-icon">
              <Check size={34} strokeWidth={3} />
            </div>
            <h2>تم إضافة حسابك بنجاح</h2>
            <p>أهلًا بك في مجتمع قطرة</p>
            <span>سيتم نقلك تلقائيًا خلال {redirectCountdown} ثوانٍ...</span>
          </div>
        </div>
      )}
      <AppHeader onBack={onBack} />

      <main className="main">
        <div className="verify-wrap">
          <div className="verify-card">
            <div className="split-form verify-form-side">
              <div className="split-form-inner verify-form-inner">
                <div className="verify-header">
                  <div className="verify-lock-icon">
                    <Lock size={28} />
                  </div>
                  <h1 className="form-title">التحقق من البريد</h1>
                  <p className="form-subtitle">
                    تم إرسال رمز التحقق إلى {email ? <bdi>{email}</bdi> : "بريدك الإلكتروني"}
                  </p>
                </div>

                {error && <div className="form-error-banner">{error}</div>}

                <div className="otp-row" dir="ltr">
                  {digits.map((digit, index) => (
                    <input
                      key={index}
                      ref={(el) => (inputsRef.current[index] = el)}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      className="otp-input"
                      value={digit}
                      onChange={handleChange(index)}
                      onKeyDown={handleKeyDown(index)}
                      disabled={isLoading}
                    />
                  ))}
                </div>

                <button
                  type="button"
                  className="form-submit-btn"
                  onClick={handleVerify}
                  disabled={isLoading}
                >
                  <span>{isLoading ? "جاري التحقق..." : "تحقق"}</span>
                </button>

                <div className="verify-resend">
                  لم تستلم الرمز؟{" "}
                  <button
                    type="button"
                    onClick={handleResend}
                    disabled={timer > 0}
                    style={{ color: timer > 0 ? "#999" : "#af101a", background: "none", border: "none", cursor: timer > 0 ? "default" : "pointer" }}
                  >
                    {timer > 0 ? `إعادة الإرسال بعد (${timer}ث)` : "إعادة إرسال الرمز"}
                  </button>
                </div>
              </div>
            </div>

            <div className="split-hero verify-hero-side">
              <div className="split-hero-glow split-hero-glow-a" />
              <div className="split-hero-glow split-hero-glow-b" />
              <div className="verify-hero-content">
                <MailCheck size={56} color="#ffffff" />
                <h2 className="verify-hero-title">أمانك أولويتنا</h2>
                <p className="verify-hero-text">
                  يرجى تأكيد هويتك لضمان سلامة وسرية البيانات الطبية.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

const BANK_SERVICES_LIST = [
  { id: "request_blood", label: "طلب الدم" },
  { id: "organize_campaigns", label: "تنظيم الحملات" },
  { id: "manage_inventory", label: "إدارة مخزون وحدات الدم" },
  { id: "receive_donors", label: "استقبال المتبرعين بالدم" },
  { id: "record_donations", label: "تسجيل نتيجة التبرع" },
  { id: "create_calls", label: "إنشاء نداءات للمتبرعين" },
  { id: "prepare_units", label: "حجز وتجهيز وحدات الدم" },
  { id: "deliver_units", label: "تسليم وحدات الدم" },
];

const DOC_TYPES = [
  {
    id: "licenseFile",
    title: "رخصة مزاولة العمل / الترخيص الصحي",
    required: true,
  },
  {
    id: "crFile",
    title: "السجل التجاري أو الاعتماد الرسمي",
    required: true,
  },
  {
    id: "delegationFile",
    title: "خطاب تفويض ممثل المؤسسة (إجباري)",
    required: true,
  },
  {
    id: "qualityFile",
    title: "شهادة الجودة أو الاعتماد (إجباري)",
    required: true,
  },
];

function InstitutionRegistrationPage({ onBack, onLogin, onSubmitSuccess }) {
  const [instStep, setInstStep] = useState(1);
  const [form, setForm] = useState({
    institutionName: "",
    institutionType: "",
    licenseNumber: "",
    address: "",
    governorate: "",
    representativeName: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [serviceScope, setServiceScope] = useState("blood_request_only");
  const [bankServices, setBankServices] = useState({
    request_blood: true,
    organize_campaigns: true,
    manage_inventory: true,
    receive_donors: true,
    record_donations: false,
    create_calls: false,
    prepare_units: true,
    deliver_units: true,
  });
  const [documents, setDocuments] = useState({
    licenseFile: null,
    crFile: null,
    delegationFile: null,
    qualityFile: null,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const updateField = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleStep1Submit = (e) => {
    e.preventDefault();

    const trimmedInstitutionName = form.institutionName.trim();
    const trimmedLicenseNumber = form.licenseNumber.trim();
    const trimmedAddress = form.address.trim();
    const trimmedRepresentativeName = form.representativeName.trim();
    const trimmedPhone = form.phone.trim();
    const trimmedEmail = form.email.trim();

    if (
      !trimmedInstitutionName ||
      !form.institutionType ||
      !trimmedLicenseNumber ||
      !trimmedAddress ||
      !form.governorate ||
      !trimmedRepresentativeName ||
      !trimmedPhone ||
      !trimmedEmail ||
      !form.password ||
      !form.confirmPassword
    ) {
      setError("يرجى تعبئة جميع الحقول المطلوبة لإنشاء حساب المؤسسة.");
      return;
    }

    if (trimmedInstitutionName.length < 3 || trimmedInstitutionName.length > 150) {
      setError("يجب أن يتكون اسم المؤسسة من 3 إلى 150 حرفًا.");
      return;
    }

    if (trimmedLicenseNumber.length < 3) {
      setError("يرجى إدخال رقم ترخيص صحيح.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      setError("يرجى إدخال بريد إلكتروني صحيح.");
      return;
    }

    if (!/^\+?[0-9\s-]{8,15}$/.test(trimmedPhone)) {
      setError("يرجى إدخال رقم هاتف صحيح.");
      return;
    }

    if (form.password.length < 8) {
      setError("يجب أن تكون كلمة المرور 8 أحرف على الأقل.");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError("كلمة المرور وتأكيدها غير متطابقتين.");
      return;
    }

    setError("");
    setInstStep(2);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleStep2Submit = async (e) => {
    e.preventDefault();
    if (
      !documents.licenseFile ||
      !documents.crFile ||
      !documents.delegationFile ||
      !documents.qualityFile
    ) {
      setError(
        "يرجى رفع جميع الوثائق المطلوبة الإجبارية قبل الإرسال."
      );
      return;
    }

    setError("");
    setIsLoading(true);

    try {
      const normalizedServiceScope = BACKEND_SERVICE_SCOPE_MAP[serviceScope] || "blood_request_only";

      const formData = new FormData();
      formData.append("institution_name", form.institutionName.trim());
      formData.append("institution_type", form.institutionType);
      formData.append("license_number", form.licenseNumber.trim());
      formData.append("address", form.address.trim());
      formData.append("governorate", form.governorate);
      formData.append("representative_name", form.representativeName.trim());
      formData.append("phone", form.phone.trim());
      formData.append("email", form.email.trim());
      formData.append("password", form.password);
      formData.append("password_confirmation", form.confirmPassword);
      formData.append("service_scope", normalizedServiceScope);

      // ملاحظة: الـ Backend لا يقبل services / services[]، الخدمات
      // الظاهرة تحت نطاق الخدمة معلومات توضيحية بالواجهة فقط ولا تُرسل.

      formData.append("practice_license_document", documents.licenseFile);
      formData.append("commercial_registration_document", documents.crFile);
      formData.append("representative_authorization_document", documents.delegationFile);
      formData.append("quality_safety_certificate_document", documents.qualityFile);

      await authApi.registerHealthInstitution(formData);
      onSubmitSuccess(form.email.trim());
    } catch (err) {
      setError(err.message || "حدث خطأ أثناء الاتصال بالخادم، يرجى المحاولة لاحقاً.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div dir="rtl" lang="ar" className="qatra-app">
      <AppHeader onBack={onBack} />

      <main className="main">
        <div className="split-layout">
          <div className="split-form inst-form-side">
            <div className="split-form-inner inst-form-inner">
              <div className="split-form-header inst-header">
                <div className="logo-badge-wrap" style={{ marginBottom: "16px" }}>
                  <div className="logo-badge" style={{ width: "96px", height: "96px" }}>
                    <img src={logoImage} alt="شعار قطرة" className="logo-image" />
                  </div>
                </div>

                <p className="inst-step-tag">
                  {instStep === 1 ? "الخطوة 1 من 2" : "الخطوة 2 من 2"}
                </p>
                <h1 className="form-title">
                  {instStep === 1
                    ? "إنشاء حساب مؤسسة صحية"
                    : "الخدمات والوثائق المطلوبة"}
                </h1>
                <p className="form-subtitle">
                  {instStep === 1
                    ? "نحن هنا لمساعدتك في الانضمام إلى منظومة التبرع بالدم وإنقاذ المزيد من الأرواح"
                    : "يرجى تحديد الخدمات التي ستقدمها المؤسسة ورفع الوثائق الرسمية المطلوبة لاستكمال التسجيل."}
                </p>

                <div className="stepper-wrap">
                  <div
                    className="stepper-step"
                    onClick={() => instStep === 2 && setInstStep(1)}
                    style={{ cursor: instStep === 2 ? "pointer" : "default" }}
                  >
                    <div
                      className={`stepper-circle ${instStep === 1 ? "active" : "completed"
                        }`}
                    >
                      {instStep === 1 ? (
                        "1"
                      ) : (
                        <Check size={16} strokeWidth={3} />
                      )}
                    </div>
                    <span
                      className={`stepper-label ${instStep === 1 ? "active-label" : "completed-label"
                        }`}
                    >
                      بيانات المؤسسة
                    </span>
                  </div>
                  <div
                    className={`stepper-line ${instStep === 2 ? "active-line" : ""
                      }`}
                  />
                  <div className="stepper-step">
                    <div
                      className={`stepper-circle ${instStep === 2 ? "active" : ""
                        }`}
                    >
                      2
                    </div>
                    <span
                      className={`stepper-label ${instStep === 2 ? "active-label" : ""
                        }`}
                    >
                      الخدمات والوثائق
                    </span>
                  </div>
                </div>
              </div>

              {instStep === 1 ? (
                <form
                  className="donor-form"
                  onSubmit={handleStep1Submit}
                  noValidate
                >
                  {error && <div className="form-error-banner">{error}</div>}

                  {/* Section 1: Organization Details */}
                  <div className="inst-section">
                    <div className="inst-section-title">
                      <Building2 size={18} />
                      <span>بيانات المؤسسة</span>
                    </div>

                    <div className="form-field">
                      <label className="form-label" htmlFor="institutionName">
                        اسم المؤسسة <span className="req-star">*</span>
                      </label>
                      <input
                        id="institutionName"
                        type="text"
                        className="form-input"
                        placeholder="أدخل اسم المؤسسة الرسمي"
                        value={form.institutionName}
                        onChange={updateField("institutionName")}
                        disabled={isLoading}
                      />
                    </div>

                    <div className="form-row">
                      <div className="form-field">
                        <label className="form-label" htmlFor="institutionType">
                          نوع المؤسسة <span className="req-star">*</span>
                        </label>
                        <div className="form-select-wrap">
                          <select
                            id="institutionType"
                            className="form-input form-select"
                            value={form.institutionType}
                            onChange={updateField("institutionType")}
                            disabled={isLoading}
                          >
                            <option value="" disabled hidden>
                              اختر نوع المؤسسة..
                            </option>
                            {INSTITUTION_TYPES.map((t) => (
                              <option key={t.value} value={t.value}>
                                {t.label}
                              </option>
                            ))}
                          </select>
                          <ChevronDown size={18} className="form-select-icon" />
                        </div>
                      </div>

                      <div className="form-field">
                        <label className="form-label" htmlFor="licenseNumber">
                          رقم الترخيص <span className="req-star">*</span>
                        </label>
                        <input
                          id="licenseNumber"
                          type="text"
                          className="form-input"
                          placeholder="أدخل رقم الترخيص"
                          value={form.licenseNumber}
                          onChange={updateField("licenseNumber")}
                          disabled={isLoading}
                        />
                      </div>
                    </div>

                    <div className="form-row">
                      <div className="form-field">
                        <label className="form-label" htmlFor="address">
                          العنوان <span className="req-star">*</span>
                        </label>
                        <input
                          id="address"
                          type="text"
                          className="form-input"
                          placeholder="أدخل عنوان المؤسسة"
                          value={form.address}
                          onChange={updateField("address")}
                          disabled={isLoading}
                        />
                      </div>

                      <div className="form-field">
                        <label className="form-label" htmlFor="governorate">
                          المحافظة <span className="req-star">*</span>
                        </label>
                        <div className="form-select-wrap">
                          <select
                            id="governorate"
                            className="form-input form-select"
                            value={form.governorate}
                            onChange={updateField("governorate")}
                            disabled={isLoading}
                          >
                            <option value="" disabled hidden>
                              اختر المحافظة
                            </option>
                            {GOVERNORATES.map((g) => (
                              <option key={g.value} value={g.value}>
                                {g.label}
                              </option>
                            ))}
                          </select>
                          <ChevronDown size={18} className="form-select-icon" />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Section 2: Representative Details */}
                  <div className="inst-section">
                    <div className="inst-section-title">
                      <UserCheck size={18} />
                      <span>بيانات الممثل الرسمي</span>
                    </div>

                    <div className="form-row">
                      <div className="form-field">
                        <label
                          className="form-label"
                          htmlFor="representativeName"
                        >
                          الاسم الكامل <span className="req-star">*</span>
                        </label>
                        <input
                          id="representativeName"
                          type="text"
                          className="form-input"
                          placeholder="أدخل الاسم الكامل"
                          value={form.representativeName}
                          onChange={updateField("representativeName")}
                          disabled={isLoading}
                        />
                      </div>

                      <div className="form-field">
                        <label className="form-label" htmlFor="phone">
                          رقم الهاتف <span className="req-star">*</span>
                        </label>
                        <input
                          id="phone"
                          type="tel"
                          dir="ltr"
                          className="form-input"
                          placeholder="05X XXX XXXX"
                          value={form.phone}
                          onChange={updateField("phone")}
                          disabled={isLoading}
                        />
                      </div>
                    </div>

                    <div className="form-field">
                      <label className="form-label" htmlFor="email">
                        البريد الإلكتروني <span className="req-star">*</span>
                      </label>
                      <input
                        id="email"
                        type="email"
                        dir="ltr"
                        className="form-input"
                        placeholder="example@email.com"
                        value={form.email}
                        onChange={updateField("email")}
                        disabled={isLoading}
                      />
                    </div>
                  </div>

                  {/* Section 3: Login Details */}
                  <div className="inst-section">
                    <div className="inst-section-title">
                      <Lock size={18} />
                      <span>بيانات الدخول</span>
                    </div>

                    <div className="form-row">
                      <div className="form-field">
                        <label className="form-label" htmlFor="password">
                          كلمة المرور <span className="req-star">*</span>
                        </label>
                        <div className="form-input-icon-wrap">
                          <input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            dir="ltr"
                            className="form-input"
                            placeholder="أدخل كلمة المرور"
                            value={form.password}
                            onChange={updateField("password")}
                            disabled={isLoading}
                          />
                          <button
                            type="button"
                            className="form-input-icon-btn"
                            onClick={() => setShowPassword((v) => !v)}
                            aria-label="إظهار كلمة المرور"
                          >
                            {showPassword ? (
                              <EyeOff size={18} />
                            ) : (
                              <Eye size={18} />
                            )}
                          </button>
                        </div>
                      </div>

                      <div className="form-field">
                        <label className="form-label" htmlFor="confirmPassword">
                          تأكيد كلمة المرور <span className="req-star">*</span>
                        </label>
                        <div className="form-input-icon-wrap">
                          <input
                            id="confirmPassword"
                            type={showConfirmPassword ? "text" : "password"}
                            dir="ltr"
                            className="form-input"
                            placeholder="أعد إدخال كلمة المرور"
                            value={form.confirmPassword}
                            onChange={updateField("confirmPassword")}
                            disabled={isLoading}
                          />
                          <button
                            type="button"
                            className="form-input-icon-btn"
                            onClick={() => setShowConfirmPassword((v) => !v)}
                            aria-label="إظهار كلمة المرور"
                          >
                            {showConfirmPassword ? (
                              <EyeOff size={18} />
                            ) : (
                              <Eye size={18} />
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="form-submit-btn"
                    disabled={isLoading}
                  >
                    <span>
                      {isLoading ? "جاري المعالجة..." : "متابعة"}
                    </span>
                    {!isLoading && <ArrowLeft size={20} />}
                  </button>

                  <p className="form-footer-text">
                    لديك حساب بالفعل؟{" "}
                    <button
                      type="button"
                      className="form-footer-link"
                      onClick={onLogin}
                    >
                      تسجيل الدخول
                    </button>
                  </p>
                </form>
              ) : (
                /* Step 2 Form */
                <form
                  className="donor-form"
                  onSubmit={handleStep2Submit}
                  noValidate
                >
                  {error && <div className="form-error-banner">{error}</div>}

                  {/* Section 1: Services Scope */}
                  <div className="inst-section">
                    <div className="inst-section-title">
                      <Stethoscope size={18} />
                      <span>حدد نطاق الخدمات المطلوبة</span>
                    </div>

                    <div className="service-scope-grid">
                      <label
                        className={`service-scope-card ${serviceScope === "blood_request_only" ? "active" : ""
                          }`}
                        onClick={() => setServiceScope("blood_request_only")}
                      >
                        <input
                          type="radio"
                          name="serviceScope"
                          value="blood_request_only"
                          checked={serviceScope === "blood_request_only"}
                          onChange={() => setServiceScope("blood_request_only")}
                          className="sr-only"
                        />
                        <div className="service-scope-icon">
                          <Droplet size={28} />
                        </div>
                        <span className="service-scope-title">طلب الدم فقط</span>
                      </label>

                      <label
                        className={`service-scope-card ${serviceScope === "blood_bank_only" ? "active" : ""
                          }`}
                        onClick={() => setServiceScope("blood_bank_only")}
                      >
                        <input
                          type="radio"
                          name="serviceScope"
                          value="blood_bank_only"
                          checked={serviceScope === "blood_bank_only"}
                          onChange={() => setServiceScope("blood_bank_only")}
                          className="sr-only"
                        />
                        <div className="service-scope-icon">
                          <Store size={28} />
                        </div>
                        <span className="service-scope-title">
                          خدمات بنك الدم فقط
                        </span>
                      </label>

                      <label
                        className={`service-scope-card ${serviceScope === "both" ? "active" : ""
                          }`}
                        onClick={() => setServiceScope("both")}
                      >
                        <input
                          type="radio"
                          name="serviceScope"
                          value="both"
                          checked={serviceScope === "both"}
                          onChange={() => setServiceScope("both")}
                          className="sr-only"
                        />
                        <div className="service-scope-icon">
                          <HeartHandshake size={28} />
                        </div>
                        <span className="service-scope-title">
                          طلب الدم وخدمات بنك الدم
                        </span>
                      </label>
                    </div>
                  </div>

                  {/* Option 1: Blood Request Only -> Split Bullet Points */}
                  {serviceScope === "blood_request_only" && (
                    <div className="inst-section animate-fade-in">
                      <div className="inst-section-title">
                        <Droplet size={18} />
                        <span>طلب الدم (request_blood)</span>
                      </div>

                      <ul className="bank-services-bullet-list">
                        <li className="bank-service-bullet-item request-blood-bullet">
                          <span className="bullet-dot highlight-dot" />
                          <span className="bank-service-label">
                            تقديم وإرسال طلبات لتوفير وحدات الدم أو المشتقات التي تحتاجها حالات المرضى عبر المنصة.
                          </span>
                        </li>
                        <li className="bank-service-bullet-item request-blood-bullet">
                          <span className="bullet-dot highlight-dot" />
                          <span className="bank-service-label">
                            متابعة حالة تلك الطلبات حتى يتم اعتمادها وتلبية احتياجاتها من قبل الجهات المختصة (مثل بنوك الدم أو المشرفين).
                          </span>
                        </li>
                      </ul>
                    </div>
                  )}

                  {/* Option 2: Bank Services Only -> Show only bank services bullet points */}
                  {serviceScope === "blood_bank_only" && (
                    <div className="inst-section animate-fade-in">
                      <div className="inst-section-title">
                        <Store size={18} />
                        <span>خدمات بنك الدم المتاحة</span>
                      </div>

                      <ul className="bank-services-bullet-list">
                        {BANK_SERVICES_LIST.map((service) => (
                          <li
                            key={service.id}
                            className="bank-service-bullet-item"
                          >
                            <span className="bullet-dot" />
                            <span className="bank-service-label">
                              {service.label}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Option 3: Request + Bank Services -> Show both sets together */}
                  {serviceScope === "both" && (
                    <div className="inst-section animate-fade-in">
                      <div className="inst-section-title">
                        <HeartHandshake size={18} />
                        <span>خدمات طلب الدم وبنك الدم المتاحة</span>
                      </div>

                      <ul className="bank-services-bullet-list">
                        <li className="bank-service-bullet-item request-blood-bullet">
                          <span className="bullet-dot highlight-dot" />
                          <span className="bank-service-label">
                            <strong>طلب الدم:</strong> تقديم وإرسال طلبات لتوفير وحدات الدم والمشتقات للمرضى عبر المنصة.
                          </span>
                        </li>
                        <li className="bank-service-bullet-item request-blood-bullet">
                          <span className="bullet-dot highlight-dot" />
                          <span className="bank-service-label">
                            <strong>متابعة الطلبات:</strong> متابعة حالة الطلبات حتى يتم اعتمادها وتلبية احتياجاتها من الجهات المختصة.
                          </span>
                        </li>
                        {BANK_SERVICES_LIST.map((service) => (
                          <li
                            key={service.id}
                            className="bank-service-bullet-item"
                          >
                            <span className="bullet-dot" />
                            <span className="bank-service-label">
                              {service.label}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Section 3: Document Uploads */}
                  <div className="inst-section">
                    <div className="inst-section-title">
                      <Upload size={18} />
                      <span>رفع الوثائق الرسمية</span>
                    </div>

                    <div className="docs-upload-grid">
                      {DOC_TYPES.map((doc) => {
                        const file = documents[doc.id];
                        return (
                          <div
                            key={doc.id}
                            className={`doc-upload-box ${file ? "uploaded" : ""
                              }`}
                          >
                            <input
                              type="file"
                              id={`doc-${doc.id}`}
                              accept=".pdf,.jpg,.jpeg,.png"
                              className="sr-only"
                              onChange={(e) => {
                                if (e.target.files && e.target.files[0]) {
                                  const selectedFile = e.target.files[0];
                                  setDocuments((prev) => ({
                                    ...prev,
                                    [doc.id]: selectedFile,
                                  }));
                                }
                              }}
                            />
                            <label
                              htmlFor={`doc-${doc.id}`}
                              className="doc-upload-label"
                            >
                              {file ? (
                                <div className="doc-uploaded-info">
                                  <FileText
                                    size={28}
                                    className="doc-uploaded-icon"
                                  />
                                  <span className="doc-uploaded-name">
                                    {file.name}
                                  </span>
                                  <span className="doc-uploaded-size">
                                    {(file.size / 1024).toFixed(1)} KB
                                  </span>
                                  <button
                                    type="button"
                                    className="doc-remove-btn"
                                    onClick={(e) => {
                                      e.preventDefault();
                                      e.stopPropagation();
                                      setDocuments((prev) => ({
                                        ...prev,
                                        [doc.id]: null,
                                      }));
                                    }}
                                  >
                                    إزالة الوثيقة
                                  </button>
                                </div>
                              ) : (
                                <>
                                  <Upload size={24} className="doc-upload-icon" />
                                  <span className="doc-title">
                                    {doc.title}{" "}
                                    {doc.required && (
                                      <span className="req-star">*</span>
                                    )}
                                  </span>
                                  <span className="doc-types-hint">
                                    PDF, JPG, PNG
                                  </span>
                                </>
                              )}
                            </label>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="form-buttons-row">
                    <button
                      type="button"
                      className="form-back-step-btn"
                      onClick={() => {
                        setError("");
                        setInstStep(1);
                      }}
                      disabled={isLoading}
                    >
                      <ChevronLeft
                        size={20}
                        style={{ transform: "rotate(180deg)" }}
                      />
                      <span>الرجوع للخطوة 1</span>
                    </button>
                    <button
                      type="submit"
                      className="form-submit-btn"
                      style={{ flex: 2, marginTop: 0 }}
                      disabled={isLoading}
                    >
                      <span>
                        {isLoading ? "جاري الإرسال..." : "إرسال طلب التسجيل"}
                      </span>
                      {!isLoading && <ArrowLeft size={20} />}
                    </button>
                  </div>

                  <p className="inst-review-hint">
                    <Info size={16} />
                    <span>
                      سيتم مراجعة الطلب من قبل مشرف الجهة الصحية قبل تفعيل الخدمات.
                    </span>
                  </p>
                </form>
              )}
            </div>
          </div>

          <div className="hero-area">
            <div className="hero-bg" />
            <div className="hero-content login-hero-content">
              <h2 className="hero-title">معًا نبني منظومة دم أكثر أمانًا وكفاءة</h2>
              <div className="impact-panel login-impact-panel">
                <div className="impact-panel-top">
                  <div className="impact-panel-icon">
                    <Building2 size={26} color="#ffffff" />
                  </div>
                  <div className="impact-panel-text">
                    <div className="impact-panel-count">1,500+</div>
                    <div className="impact-panel-label">مؤسسة صحية تثق بقطرة</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

/* ────────────────────────────────────────────
   لوحة تحكم المتبرع
──────────────────────────────────────────── */
function DonorDashboard({ user, onLogout }) {
  return (
    <div dir="rtl" lang="ar" className="qatra-app">
      <header className="header">
        <div className="header-inner">
          <a href="#" className="logo">Qatra</a>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <span style={{ color: "#af101a", fontWeight: 600, fontSize: "0.9rem" }}>
              🩸 {user?.name || "متبرع"}
            </span>
            <button className="login-btn" onClick={onLogout}>تسجيل الخروج</button>
          </div>
        </div>
      </header>

      <main className="main" style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "80vh" }}>
        <div style={{ textAlign: "center", padding: "2rem", maxWidth: "500px" }}>
          <div style={{
            width: "100px", height: "100px", borderRadius: "50%",
            background: "linear-gradient(135deg, #af101a, #e53935)",
            display: "flex", alignItems: "center", justifyContent: "center",
            margin: "0 auto 1.5rem", fontSize: "2.5rem",
            boxShadow: "0 8px 32px rgba(175,16,26,0.3)"
          }}>🩸</div>

          <h1 style={{ color: "#af101a", fontSize: "2rem", marginBottom: "0.5rem" }}>
            مرحباً، {user?.name || "متبرع"}
          </h1>
          <p style={{ color: "#888", fontSize: "1rem", marginBottom: "2rem" }}>
            أنت الآن في لوحة تحكم المتبرع
          </p>

          <div style={{
            padding: "1.5rem 2rem",
            background: "rgba(175,16,26,0.06)",
            borderRadius: "16px",
            border: "1px dashed rgba(175,16,26,0.3)",
          }}>
            <p style={{ color: "#af101a", fontWeight: 600, margin: 0 }}>
              🚧 لوحة تحكم المتبرع قيد الإنشاء
            </p>
            <p style={{ color: "#999", fontSize: "0.85rem", marginTop: "0.5rem" }}>
              ستتمكن قريباً من إدارة تبرعاتك ومتابعة طلبات الدم
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

/* ────────────────────────────────────────────
   لوحة تحكم المستشفى / الجهة الطبية
──────────────────────────────────────────── */
function InstitutionDashboard({ user, onLogout }) {
  return (
    <div dir="rtl" lang="ar" className="qatra-app">
      <header className="header">
        <div className="header-inner">
          <a href="#" className="logo">Qatra</a>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <span style={{ color: "#005faf", fontWeight: 600, fontSize: "0.9rem" }}>
              🏥 {user?.name || "جهة طبية"}
            </span>
            <button className="login-btn" onClick={onLogout}>تسجيل الخروج</button>
          </div>
        </div>
      </header>

      <main className="main" style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "80vh" }}>
        <div style={{ textAlign: "center", padding: "2rem", maxWidth: "500px" }}>
          <div style={{
            width: "100px", height: "100px", borderRadius: "50%",
            background: "linear-gradient(135deg, #005faf, #1976d2)",
            display: "flex", alignItems: "center", justifyContent: "center",
            margin: "0 auto 1.5rem", fontSize: "2.5rem",
            boxShadow: "0 8px 32px rgba(0,95,175,0.3)"
          }}>🏥</div>

          <h1 style={{ color: "#005faf", fontSize: "2rem", marginBottom: "0.5rem" }}>
            مرحباً، {user?.name || "جهة طبية"}
          </h1>
          <p style={{ color: "#888", fontSize: "1rem", marginBottom: "2rem" }}>
            أنت الآن في لوحة تحكم الجهة الطبية
          </p>

          <div style={{
            padding: "1.5rem 2rem",
            background: "rgba(0,95,175,0.06)",
            borderRadius: "16px",
            border: "1px dashed rgba(0,95,175,0.3)",
          }}>
            <p style={{ color: "#005faf", fontWeight: 600, margin: 0 }}>
              🚧 لوحة تحكم المستشفى قيد الإنشاء
            </p>
            <p style={{ color: "#999", fontSize: "0.85rem", marginTop: "0.5rem" }}>
              ستتمكن قريباً من إدارة طلبات الدم وتنسيق الحملات
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

/* ────────────────────────────────────────────
   لوحة تحكم المشرف
──────────────────────────────────────────── */
function AdminDashboard({ user, onLogout }) {
  return (
    <div dir="rtl" lang="ar" className="qatra-app">
      <header className="header">
        <div className="header-inner">
          <a href="#" className="logo">Qatra</a>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <span style={{ color: "#6a1b9a", fontWeight: 600, fontSize: "0.9rem" }}>
              🛡️ {user?.name || "مشرف"}
            </span>
            <button className="login-btn" onClick={onLogout}>تسجيل الخروج</button>
          </div>
        </div>
      </header>

      <main className="main" style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "80vh" }}>
        <div style={{ textAlign: "center", padding: "2rem", maxWidth: "500px" }}>
          <div style={{
            width: "100px", height: "100px", borderRadius: "50%",
            background: "linear-gradient(135deg, #6a1b9a, #9c27b0)",
            display: "flex", alignItems: "center", justifyContent: "center",
            margin: "0 auto 1.5rem", fontSize: "2.5rem",
            boxShadow: "0 8px 32px rgba(106,27,154,0.3)"
          }}>🛡️</div>

          <h1 style={{ color: "#6a1b9a", fontSize: "2rem", marginBottom: "0.5rem" }}>
            مرحباً، {user?.name || "مشرف"}
          </h1>
          <p style={{ color: "#888", fontSize: "1rem", marginBottom: "2rem" }}>
            أنت الآن في لوحة تحكم المشرف
          </p>

          <div style={{
            padding: "1.5rem 2rem",
            background: "rgba(106,27,154,0.06)",
            borderRadius: "16px",
            border: "1px dashed rgba(106,27,154,0.3)",
          }}>
            <p style={{ color: "#6a1b9a", fontWeight: 600, margin: 0 }}>
              🚧 لوحة تحكم المشرف قيد الإنشاء
            </p>
            <p style={{ color: "#999", fontSize: "0.85rem", marginTop: "0.5rem" }}>
              ستتمكن قريباً من إدارة المستخدمين والإشراف على المنصة
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

/* ────────────────────────────────────────────
   موجّه الـ Dashboard — يختار الصفحة حسب نوع الحساب
──────────────────────────────────────────── */
function DashboardPage({ user, onLogout }) {
  const type = user?.account_type;

  if (type === "donor") {
    return <DonorDashboard user={user} onLogout={onLogout} />;
  }

  if (type === "health_institution") {
    return <InstitutionDashboard user={user} onLogout={onLogout} />;
  }

  if (type === "health_authority_admin") {
    return <AdminDashboard user={user} onLogout={onLogout} />;
  }

  // fallback — نوع غير معروف، نعرض كامل الداتا لتشخيص المشكلة
  return (
    <div dir="rtl" lang="ar" className="qatra-app">
      <header className="header">
        <div className="header-inner">
          <a href="#" className="logo">Qatra</a>
          <button className="login-btn" onClick={onLogout}>تسجيل الخروج</button>
        </div>
      </header>
      <main className="main" style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "80vh" }}>
        <div style={{ textAlign: "center", color: "#999", maxWidth: "600px", padding: "2rem" }}>
          <p style={{ fontSize: "1.1rem", color: "#af101a", fontWeight: 600 }}>🔍 بيانات الحساب المستلمة من الباكند:</p>
          <pre style={{
            background: "#1a1a2e", color: "#00ff88", padding: "1.5rem",
            borderRadius: "12px", textAlign: "left", direction: "ltr",
            fontSize: "0.85rem", overflowX: "auto", marginTop: "1rem"
          }}>
            {JSON.stringify(user, null, 2)}
          </pre>
          <button className="login-btn" onClick={onLogout} style={{ marginTop: "1.5rem" }}>تسجيل الخروج</button>
        </div>
      </main>
    </div>
  );
}

export default function App() {
  const [selected, setSelected] = useState(null);
  const [step, setStep] = useState("login"); // 'login' | 'home' | 'donorForm' | 'institutionForm' | 'verifyEmail' | 'dashboard'
  const [donorEmail, setDonorEmail] = useState("");
  const [verifyAccountType, setVerifyAccountType] = useState("donor");
  const [loggedInUser, setLoggedInUser] = useState(null);

  const handleContinue = () => {
    if (!selected) return;

    if (selected === "donor") {
      setStep("donorForm");
      return;
    }

    if (selected === "institution") {
      setStep("institutionForm");
      return;
    }

    const type = ACCOUNT_TYPES.find((t) => t.id === selected);
    alert(`تم اختيار نوع الحساب: ${type.title}`);
  };

  if (step === "dashboard") {
    return (
      <DashboardPage
        user={loggedInUser}
        onLogout={() => {
          setLoggedInUser(null);
          setStep("login");
        }}
      />
    );
  }

  if (step === "login") {
    return (
      <LoginPage
        onCreateAccount={() => setStep("home")}
        onLoginSuccess={(res) => {
          const user = res?.data?.user || res?.user || res;
          const token = res?.data?.token || res?.token;
          if (token) localStorage.setItem("auth_token", token);
          setLoggedInUser(user);
          setStep("dashboard");
        }}
      />
    );
  }

  if (step === "donorForm") {
    return (
      <DonorRegistrationPage
        onBack={() => setStep("home")}
        onLogin={() => setStep("login")}
        onSubmitSuccess={(email) => {
          setDonorEmail(email);
          setVerifyAccountType("donor");
          setStep("verifyEmail");
        }}
      />
    );
  }

  if (step === "institutionForm") {
    return (
      <InstitutionRegistrationPage
        onBack={() => setStep("home")}
        onLogin={() => setStep("login")}
        onSubmitSuccess={(email) => {
          setDonorEmail(email);
          setVerifyAccountType("institution");
          setStep("verifyEmail");
        }}
      />
    );
  }

  if (step === "verifyEmail") {
    return (
      <EmailVerificationPage
        email={donorEmail}
        accountType={verifyAccountType}
        onBack={() =>
          setStep(verifyAccountType === "institution" ? "institutionForm" : "donorForm")
        }
        onVerified={() => {
          setStep("login");
          setSelected(null);
        }}
      />
    );
  }

  return (
    <div dir="rtl" lang="ar" className="qatra-app">
      <header className="header">
        <div className="header-inner">
          <a href="#" className="logo">
            Qatra
          </a>
          <button className="login-btn" onClick={() => setStep("login")}>تسجيل الدخول</button>
        </div>
      </header>

      <main className="main">
        <div className="main-inner">
          <div className="selection-area">
            <div className="selection-content">
              <div className="logo-badge-wrap">
                <div className="logo-badge">
                  <img src={logoImage} alt="Qatra logo" className="logo-image" />
                </div>
              </div>

              <div className="title-block">
                <h1 className="title">إنشاء حساب جديد</h1>
                <p className="subtitle">يرجى تحديد نوع الحساب للمتابعة</p>
              </div>

              <div className="card-list">
                {ACCOUNT_TYPES.map((type) => {
                  const isSelected = selected === type.id;
                  const { Icon } = type;
                  return (
                    <button
                      key={type.id}
                      onClick={() => setSelected(type.id)}
                      className={`account-card${isSelected ? " selected" : ""}`}
                      style={{
                        borderColor: isSelected ? type.accent : undefined,
                      }}
                    >
                      <div className="tint-overlay" style={{ backgroundColor: type.accent }} />
                      <div className="icon-circle" style={{ color: type.accent }}>
                        <Icon size={30} strokeWidth={2} />
                      </div>
                      <div className="card-text">
                        <h3
                          className="card-title"
                          style={{ color: isSelected ? type.accent : undefined }}
                        >
                          {type.title}
                        </h3>
                        <p className="card-desc">{type.description}</p>
                      </div>
                      <div
                        className="card-trailing"
                        style={{ color: isSelected ? type.accent : undefined }}
                      >
                        {isSelected ? (
                          <span
                            className="check-badge"
                            style={{ backgroundColor: type.accent }}
                          >
                            <Check size={16} color="#fff" strokeWidth={3} />
                          </span>
                        ) : (
                          <ChevronLeft size={22} />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>

              <button
                className={`continue-btn${selected ? " active" : ""}`}
                disabled={!selected}
                onClick={handleContinue}
              >
                متابعة
              </button>
            </div>
          </div>

          <div className="hero-area">
            <div className="hero-bg" />
            <div className="hero-content">
              <h2 className="hero-title">خطوتك الأولى لإنقاذ حياة</h2>
              <p className="hero-text">
                كل قطرة دم تتبرع بها تزرع أملاً جديداً. انضم إلينا اليوم وكن جزءاً من رحلة العطاء.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
