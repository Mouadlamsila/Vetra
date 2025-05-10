const ownerAr = {
  welcome: {
    title: "مرحباً!",
    subtitle: "هل تريد أن تكون صاحب متجر؟",
    startButton: "نعم، دعنا نبدأ"
  },
  steps: {
    confirmation: "تأكيد المالك",
    experience: "الخبرة السابقة",
    timeCommitment: "الالتزام الزمني",
    businessExperience: "الخبرة التجارية",
    contactInfo: "معلومات الاتصال",
    completion: "الإكمال"
  },
  experience: {
    title: "الخبرة والخدمات",
    storeQuestion: "هل سبق لك امتلاك أو تشغيل متجر من قبل؟",
    deliveryQuestion: "هل سيتطلب عملك خدمات التوصيل؟",
    yes: "نعم",
    no: "لا"
  },
  timeCommitment: {
    title: "الموردون والالتزام الزمني",
    supplierQuestion: "هل لديك موردون لعملك بالفعل؟",
    timeQuestion: "كم من الوقت يمكنك تخصيصه لعملك يومياً؟",
    timeOptions: {
      "1-2 hours": "1-2 ساعات",
      "3-4 hours": "3-4 ساعات",
      "5-6 hours": "5-6 ساعات",
      "7-8 hours": "7-8 ساعات",
      "More than 8 hours": "أكثر من 8 ساعات"
    }
  },
  businessExperience: {
    title: "الخبرة التجارية",
    subtitle: "منذ متى وأنت في هذا المجال؟",
    options: {
      just_starting: "أبدأ للتو",
      less_than_6_months: "أقل من 6 أشهر",
      between_6_12_months: "بين 6-12 شهر",
      more_than_a_year: "أكثر من سنة",
      more_than_3_years: "أكثر من 3 سنوات"
    }
  },
  contactInfo: {
    title: "معلومات الاتصال",
    phone: "رقم الهاتف",
    phonePlaceholder: "أدخل رقم هاتفك",
    address: {
      line1: "عنوان السطر 1",
      line1Placeholder: "العنوان البريدي",
      line2: "عنوان السطر 2",
      line2Placeholder: "شقة، جناح، وحدة، إلخ (اختياري)",
      city: "المدينة",
      cityPlaceholder: "المدينة",
      country: "البلد",
      countryPlaceholder: "البلد",
      postalCode: "الرمز البريدي",
      postalCodePlaceholder: "الرمز البريدي"
    }
  },
  completion: {
    title: "تهانينا!",
    message: "لقد أكملت بنجاح عملية التسجيل كمالك.",
    subMessage: "يمكنك الآن البدء في إنشاء متجرك وبدء رحلة عملك.",
    createStore: "إنشاء متجرك",
    returnHome: "العودة إلى الرئيسية"
  },
  navigation: {
    previous: "السابق",
    next: "التالي",
    submit: "إرسال"
  },
  validation: {
    previousExperience: "يرجى الإشارة إلى ما إذا كان لديك خبرة سابقة في المتاجر",
    deliveryRequired: "يرجى الإشارة إلى ما إذا كانت خدمات التوصيل مطلوبة",
    suppliers: "يرجى الإشارة إلى ما إذا كان لديك موردون",
    timeAvailable: "يرجى تحديد التزامك الزمني اليومي",
    businessDuration: "يرجى تحديد مدة خبرتك التجارية",
    phone: {
      required: "رقم الهاتف مطلوب",
      invalid: "يرجى إدخال رقم هاتف صالح"
    },
    address: {
      line1: "عنوان السطر 1 مطلوب",
      city: "المدينة مطلوبة",
      country: "البلد مطلوب",
      postalCode: "الرمز البريدي مطلوب"
    }
  },
  toast: {
    completeFields: "يرجى إكمال جميع الحقول المطلوبة قبل المتابعة",
    success: "تم إرسال استبيان الأعمال بنجاح!",
    error: {
      userNotAuth: "المستخدم غير مصادق",
      uploadFailed: "فشل في تحميل الصورة",
      updateFailed: "فشل في تحديث المستخدم",
      surveyFailed: "فشل في إنشاء الاستبيان",
      serverError: "حدث خطأ في الخادم",
      networkError: "لا يوجد رد من الخادم. يرجى التحقق من اتصال الإنترنت الخاص بك.",
      unexpectedError: "حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى."
    }
  }
};

export default ownerAr; 