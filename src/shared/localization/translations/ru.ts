export default {
  translation: {
    auth: {
      login: {
        title: 'Вход',
        email: 'Электронная почта',
        password: 'Пароль',
        loginButton: 'Войти',
        noAccount: 'Нет аккаунта? Зарегистрироваться',
        errors: {
        fillAllFields: 'Пожалуйста, заполните все поля',
        invalidEmail: 'Пожалуйста, введите действительный адрес электронной почты',
        loginFailed: 'Ошибка входа',
        invalidCredentials: 'Неверный email или пароль. Пожалуйста, попробуйте снова.',
      },
      },
      register: {
        title: 'Регистрация',
        nickname: 'Никнейм',
        email: 'Электронная почта',
        password: 'Пароль',
        registerButton: 'Зарегистрироваться',
        haveAccount: 'Уже есть аккаунт? Войти',
        errors: {
        fillAllFields: 'Пожалуйста, заполните все поля',
        invalidEmail: 'Пожалуйста, введите действительный адрес электронной почты',
        passwordTooShort: 'Пароль должен содержать не менее 6 символов',
        registrationFailed: 'Ошибка регистрации',
        registrationError: 'Не удалось создать аккаунт. Email может быть уже использован.',
      },
      },
    },
    tabs: {
      map: 'Карта',
      chats: 'Чаты',
      settings: 'Настройки',
    },
    map: {
      title: 'Карта',
      loading: 'Загрузка карты Кипра…',
      loadError: 'Не удалось загрузить карту Кипра',
      addReport: 'Добавить',
      locationNotice: {
        title: 'Уведомление о местоположении',
        message: 'Вы находитесь за пределами Кипра. Эта карта показывает только регион Кипра.',
      },
      outOfBounds: {
        title: 'Вне границ',
        message: 'Вы можете создавать отчеты только в пределах Кипра.',
      },
      permissions: {
        title: 'Требуется разрешение на геолокацию',
        message: 'Чтобы показать ваше местоположение на карте, пожалуйста, включите разрешения на геолокацию в настройках устройства.',
        cancel: 'Отмена',
        openSettings: 'Открыть настройки',
        bannerTitle: 'Требуется доступ к местоположению',
        bannerMessage: 'Включите разрешения на геолокацию, чтобы видеть свое положение на карте.',
      },
    },
    chats: {
      title: 'Экран чатов',
    },
    settings: {
      profile: {
        title: 'Профиль',
        email: 'Email',
        nickname: 'Никнейм',
        role: 'Роль',
      },
      logout: 'Выйти',
    },
    home: {
      welcome: 'Добро пожаловать!',
      email: 'Email:',
      nickname: 'Никнейм:',
      role: 'Роль:',
      logout: 'Выйти',
    },
    common: {
      error: 'Ошибка',
      cancel: 'Отмена',
      submit: 'Отправить',
    },
    report: {
      createReport: 'Создать отчет',
      incidentType: 'Тип инцидента',
      fire: 'Пожар',
      rescue: 'Спасение',
      comment: 'Комментарий',
      commentPlaceholder: 'Опишите инцидент...',
      error: 'Ошибка',
      commentTooShort: 'Комментарий должен содержать не менее 3 символов',
      photos: 'Фотографии',
      addPhoto: 'Добавить фото',
      photoPermissionTitle: 'Требуется разрешение',
      photoPermissionMessage: 'Пожалуйста, предоставьте доступ к вашей фотогалерее для прикрепления изображений.',
    },
  },
};
