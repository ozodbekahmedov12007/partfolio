import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      "nav": {
        "about": "About",
        "skills": "Skills",
        "projects": "Projects",
        "articles": "Articles",
        "contact": "Contact"
      },
      "hero": {
        "greeting": "Hi, I'm",
        "role": "Full-Stack Developer",
        "description": "I build scalable web applications and craft beautiful digital experiences.",
        "viewWork": "View My Work",
        "contactMe": "Contact Me",
        "available": "Available for new opportunities",
        "loading": "Loading system data..."
      },
      "about": {
        "title": "About Me",
        "subtitle": "A brief look into my background and what drives me.",
        "whoAmI": "Who am I?",
        "description1": "I am a passionate software engineer with a strong foundation in both front-end and back-end development. I love solving complex problems and turning ideas into reality through code.",
        "description2": "My journey in tech started with a curiosity for how things work on the web. Over the years, I've honed my skills in modern JavaScript frameworks, server-side technologies, and database management.",
        "experience": "Years Experience",
        "projects": "Projects Completed",
        "clients": "Happy Clients"
      },
      "services": {
        "title": "What I Do",
        "subtitle": "My core competencies and services.",
        "frontend": "Frontend Development",
        "frontendDesc": "Building responsive, accessible, and performant user interfaces using React, Next.js, and modern CSS frameworks.",
        "backend": "Backend Development",
        "backendDesc": "Designing robust APIs and microservices with Node.js, Express, and integrating with SQL/NoSQL databases.",
        "architecture": "System Architecture",
        "architectureDesc": "Planning and designing scalable cloud infrastructure and deployment pipelines for modern web applications."
      },
      "experience": {
        "title": "Experience",
        "subtitle": "My professional journey so far.",
        "items": [
          { "role": "Senior Full-Stack Engineer", "company": "Tech Innovators Inc.", "period": "2022 - Present", "desc": "Leading the development of scalable microservices and architecting modern frontend applications using React and Next.js." },
          { "role": "Software Developer", "company": "Digital Solutions Agency", "period": "2020 - 2022", "desc": "Developed and maintained multiple client projects, focusing on responsive design, performance optimization, and API integrations." },
          { "role": "Junior Web Developer", "company": "StartUp Hub", "period": "2019 - 2020", "desc": "Assisted in building MVP products for early-stage startups, gaining hands-on experience with modern web technologies." }
        ]
      },
      "skills": {
        "title": "Technical Arsenal",
        "subtitle": "Tools and technologies I use to build things.",
        "noSkills": "No skills added yet."
      },
      "projects": {
        "title": "Featured Projects",
        "subtitle": "Some of my recent work.",
        "viewProject": "View Project",
        "systemsActive": "Systems Active",
        "noProjects": "No deployments found in database.",
        "liveDemo": "Live Demo",
        "back": "Back to Systems",
        "overview": "System Overview",
        "sourceCode": "Source Code",
        "launch": "Launch Application",
        "feedback": "Feedback & Interaction",
        "likes": "Likes",
        "noComments": "No comments yet. Be the first to share your thoughts!",
        "namePlaceholder": "Your Name (Optional)",
        "commentPlaceholder": "Write a comment...",
        "postComment": "Post Comment",
        "posting": "Posting..."
      },
      "articles": {
        "title": "Writings & Insights",
        "subtitle": "Thoughts on software engineering, architecture, and technology.",
        "views": "views",
        "readArticle": "Read Article",
        "loading": "Loading article data...",
        "authorRole": "Author & Developer"
      },
      "contact": {
        "title": "Initialize Connection",
        "subtitle": "Open a secure channel for collaboration or inquiries.",
        "name": "Name",
        "email": "Email",
        "message": "Message",
        "send": "Send Message",
        "sending": "Sending...",
        "sent": "Message Sent!",
        "error": "Failed to send message. Please try again.",
        "namePlaceholder": "John Doe",
        "emailPlaceholder": "john@example.com",
        "messagePlaceholder": "How can I help you?"
      },
      "footer": {
        "rights": "All systems operational."
      }
    }
  },
  uz: {
    translation: {
      "nav": {
        "about": "Haqimda",
        "skills": "Ko'nikmalar",
        "projects": "Loyihalar",
        "articles": "Maqolalar",
        "contact": "Aloqa"
      },
      "hero": {
        "greeting": "Salom, men",
        "role": "Full-Stack Dasturchi",
        "description": "Men kengaytiriladigan veb-ilovalarni yarataman va ajoyib raqamli tajribalarni taqdim etaman.",
        "viewWork": "Ishlarimni ko'rish",
        "contactMe": "Men bilan bog'lanish",
        "available": "Yangi imkoniyatlar uchun ochiqman",
        "loading": "Tizim ma'lumotlari yuklanmoqda..."
      },
      "about": {
        "title": "Men Haqimda",
        "subtitle": "Mening tajribam va maqsadlarim haqida qisqacha ma'lumot.",
        "whoAmI": "Men kimman?",
        "description1": "Men front-end va back-end dasturlashda kuchli poydevorga ega bo'lgan ishtiyoqli dasturiy ta'minot muhandisiman. Murakkab muammolarni hal qilishni va g'oyalarni kod orqali haqiqatga aylantirishni yaxshi ko'raman.",
        "description2": "Texnologiyadagi sayohatim vebda narsalar qanday ishlashiga bo'lgan qiziqishdan boshlangan. Yillar davomida men zamonaviy JavaScript freymvorklari, server texnologiyalari va ma'lumotlar bazalarini boshqarish bo'yicha o'z mahoratimni oshirdim.",
        "experience": "Yillik Tajriba",
        "projects": "Tugallangan Loyihalar",
        "clients": "Xursand Mijozlar"
      },
      "services": {
        "title": "Nima Qilaman",
        "subtitle": "Mening asosiy vakolatlarim va xizmatlarim.",
        "frontend": "Frontend Dasturlash",
        "frontendDesc": "React, Next.js va zamonaviy CSS freymvorklaridan foydalangan holda moslashuvchan, qulay va tezkor foydalanuvchi interfeyslarini yaratish.",
        "backend": "Backend Dasturlash",
        "backendDesc": "Node.js, Express yordamida mustahkam API va mikroservislarni loyihalash hamda SQL/NoSQL ma'lumotlar bazalari bilan integratsiya qilish.",
        "architecture": "Tizim Arxitekturasi",
        "architectureDesc": "Zamonaviy veb-ilovalar uchun kengaytiriladigan bulutli infratuzilma va joylashtirish quvurlarini rejalashtirish va loyihalash."
      },
      "experience": {
        "title": "Tajriba",
        "subtitle": "Mening professional sayohatim.",
        "items": [
          { "role": "Katta Full-Stack Muhandis", "company": "Tech Innovators Inc.", "period": "2022 - Hozirgacha", "desc": "Kengaytiriladigan mikroservislarni ishlab chiqishga rahbarlik qilish va React va Next.js yordamida zamonaviy frontend ilovalarini loyihalash." },
          { "role": "Dasturiy Ta'minot Dasturchisi", "company": "Digital Solutions Agency", "period": "2020 - 2022", "desc": "Ko'plab mijozlar loyihalarini ishlab chiqish va qo'llab-quvvatlash, moslashuvchan dizayn, unumdorlikni optimallashtirish va API integratsiyasiga e'tibor qaratish." },
          { "role": "Kichik Veb Dasturchi", "company": "StartUp Hub", "period": "2019 - 2020", "desc": "Erta bosqichdagi startaplar uchun MVP mahsulotlarini yaratishda yordam berish, zamonaviy veb-texnologiyalar bilan amaliy tajriba orttirish." }
        ]
      },
      "skills": {
        "title": "Texnik Arsenal",
        "subtitle": "Men narsalarni qurish uchun foydalanadigan vositalar va texnologiyalar.",
        "noSkills": "Hali ko'nikmalar qo'shilmagan."
      },
      "projects": {
        "title": "Tanlangan Loyihalar",
        "subtitle": "Mening so'nggi ishlarimdan ba'zilari.",
        "viewProject": "Loyihani Ko'rish",
        "systemsActive": "Tizimlar Faol",
        "noProjects": "Ma'lumotlar bazasida loyihalar topilmadi.",
        "liveDemo": "Jonli Demo",
        "back": "Tizimlarga qaytish",
        "overview": "Tizim sharhi",
        "sourceCode": "Manba kodi",
        "launch": "Ilovani ishga tushirish",
        "feedback": "Fikr-mulohaza va o'zaro aloqa",
        "likes": "Yoqtirishlar",
        "noComments": "Hali izohlar yo'q. Birinchi bo'lib o'z fikringizni bildiring!",
        "namePlaceholder": "Ismingiz (ixtiyoriy)",
        "commentPlaceholder": "Izoh yozing...",
        "postComment": "Izoh qoldirish",
        "posting": "Yuborilmoqda..."
      },
      "articles": {
        "title": "Maqolalar va Fikrlar",
        "subtitle": "Dasturiy ta'minot muhandisligi, arxitektura va texnologiya haqida fikrlar.",
        "views": "ko'rishlar",
        "readArticle": "Maqolani O'qish",
        "loading": "Maqola yuklanmoqda...",
        "authorRole": "Muallif va Dasturchi"
      },
      "contact": {
        "title": "Aloqa O'rnatish",
        "subtitle": "Hamkorlik yoki so'rovlar uchun xavfsiz kanalni oching.",
        "name": "Ism",
        "email": "Elektron pochta",
        "message": "Xabar",
        "send": "Xabarni Yuborish",
        "sending": "Yuborilmoqda...",
        "sent": "Xabar Yuborildi!",
        "error": "Xabarni yuborishda xatolik yuz berdi. Iltimos, qayta urinib ko'ring.",
        "namePlaceholder": "Eshmat Toshmatov",
        "emailPlaceholder": "eshmat@example.com",
        "messagePlaceholder": "Sizga qanday yordam bera olaman?"
      },
      "footer": {
        "rights": "Barcha tizimlar ishlamoqda."
      }
    }
  },
  ru: {
    translation: {
      "nav": {
        "about": "Обо мне",
        "skills": "Навыки",
        "projects": "Проекты",
        "articles": "Статьи",
        "contact": "Контакты"
      },
      "hero": {
        "greeting": "Привет, я",
        "role": "Full-Stack Разработчик",
        "description": "Я создаю масштабируемые веб-приложения и красивые цифровые интерфейсы.",
        "viewWork": "Смотреть работы",
        "contactMe": "Связаться со мной",
        "available": "Доступен для новых проектов",
        "loading": "Загрузка системных данных..."
      },
      "about": {
        "title": "Обо мне",
        "subtitle": "Краткий обзор моего опыта и того, что меня вдохновляет.",
        "whoAmI": "Кто я?",
        "description1": "Я страстный инженер-программист с прочным фундаментом как во фронтенд, так и в бэкенд разработке. Я люблю решать сложные задачи и воплощать идеи в реальность с помощью кода.",
        "description2": "Мой путь в технологиях начался с любопытства к тому, как все работает в интернете. За годы я отточил свои навыки в современных JavaScript фреймворках, серверных технологиях и управлении базами данных.",
        "experience": "Лет Опыта",
        "projects": "Завершенных Проектов",
        "clients": "Счастливых Клиентов"
      },
      "services": {
        "title": "Что я делаю",
        "subtitle": "Мои основные компетенции и услуги.",
        "frontend": "Фронтенд Разработка",
        "frontendDesc": "Создание адаптивных, доступных и производительных пользовательских интерфейсов с использованием React, Next.js и современных CSS фреймворков.",
        "backend": "Бэкенд Разработка",
        "backendDesc": "Проектирование надежных API и микросервисов с помощью Node.js, Express и интеграция с SQL/NoSQL базами данных.",
        "architecture": "Архитектура Систем",
        "architectureDesc": "Планирование и проектирование масштабируемой облачной инфраструктуры и конвейеров развертывания для современных веб-приложений."
      },
      "experience": {
        "title": "Опыт",
        "subtitle": "Мой профессиональный путь.",
        "items": [
          { "role": "Старший Full-Stack Инженер", "company": "Tech Innovators Inc.", "period": "2022 - Наст. время", "desc": "Руководство разработкой масштабируемых микросервисов и проектирование современных фронтенд-приложений с использованием React и Next.js." },
          { "role": "Разработчик ПО", "company": "Digital Solutions Agency", "period": "2020 - 2022", "desc": "Разработка и поддержка множества клиентских проектов с упором на адаптивный дизайн, оптимизацию производительности и интеграцию API." },
          { "role": "Младший веб-разработчик", "company": "StartUp Hub", "period": "2019 - 2020", "desc": "Помощь в создании MVP-продуктов для стартапов на ранних стадиях, получение практического опыта работы с современными веб-технологиями." }
        ]
      },
      "skills": {
        "title": "Технический Арсенал",
        "subtitle": "Инструменты и технологии, которые я использую для создания проектов.",
        "noSkills": "Навыки еще не добавлены."
      },
      "projects": {
        "title": "Избранные Проекты",
        "subtitle": "Некоторые из моих недавних работ.",
        "viewProject": "Смотреть Проект",
        "systemsActive": "Систем Активно",
        "noProjects": "Проекты в базе данных не найдены.",
        "liveDemo": "Демо",
        "back": "Назад к системам",
        "overview": "Обзор системы",
        "sourceCode": "Исходный код",
        "launch": "Запустить приложение",
        "feedback": "Отзывы и взаимодействие",
        "likes": "Лайков",
        "noComments": "Комментариев пока нет. Будьте первым, кто поделится своим мнением!",
        "namePlaceholder": "Ваше имя (необязательно)",
        "commentPlaceholder": "Напишите комментарий...",
        "postComment": "Опубликовать",
        "posting": "Публикация..."
      },
      "articles": {
        "title": "Статьи и Мысли",
        "subtitle": "Мысли о программной инженерии, архитектуре и технологиях.",
        "views": "просмотров",
        "readArticle": "Читать Статью",
        "loading": "Загрузка статьи...",
        "authorRole": "Автор и Разработчик"
      },
      "contact": {
        "title": "Инициализация Связи",
        "subtitle": "Откройте безопасный канал для сотрудничества или запросов.",
        "name": "Имя",
        "email": "Электронная почта",
        "message": "Сообщение",
        "send": "Отправить Сообщение",
        "sending": "Отправка...",
        "sent": "Сообщение Отправлено!",
        "error": "Не удалось отправить сообщение. Пожалуйста, попробуйте еще раз.",
        "namePlaceholder": "Иван Иванов",
        "emailPlaceholder": "ivan@example.com",
        "messagePlaceholder": "Чем я могу вам помочь?"
      },
      "footer": {
        "rights": "Все системы работают нормально."
      }
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: localStorage.getItem('lang') || 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
