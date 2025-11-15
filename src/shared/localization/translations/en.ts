export default {
  translation: {
    auth: {
      login: {
        title: 'Login',
        email: 'Email',
        password: 'Password',
        loginButton: 'Login',
        noAccount: "Don't have an account? Register",
        errors: {
        fillAllFields: 'Please fill in all fields',
        invalidEmail: 'Please enter a valid email address',
        loginFailed: 'Login Failed',
        invalidCredentials: 'Invalid email or password. Please try again.',
      },
      },
      register: {
        title: 'Register',
        nickname: 'Nickname',
        email: 'Email',
        password: 'Password',
        registerButton: 'Register',
        haveAccount: 'Already have an account? Login',
        errors: {
        fillAllFields: 'Please fill in all fields',
        invalidEmail: 'Please enter a valid email address',
        passwordTooShort: 'Password must be at least 6 characters',
        registrationFailed: 'Registration Failed',
        registrationError: 'Unable to create account. Email may already be in use.',
      },
      },
    },
    tabs: {
      map: 'Map',
      chats: 'Chats',
      settings: 'Settings',
    },
    map: {
      title: 'Map Screen',
      loading: 'Loading Cyprus map…',
      loadError: 'Failed to load Cyprus tiles',
      locationNotice: {
        title: 'Location Notice',
        message: 'You are currently outside Cyprus. This map only shows Cyprus region.',
      },
      permissions: {
        title: 'Location Permission Required',
        message: 'To show your position on the map, please enable location permissions in your device settings.',
        cancel: 'Cancel',
        openSettings: 'Open Settings',
        bannerTitle: 'Location Access Needed',
        bannerMessage: 'Enable location permissions to see your position on the map.',
      },
    },
    chats: {
      title: 'Chats Screen',
    },
    settings: {
      profile: {
        title: 'Profile',
        email: 'Email',
        nickname: 'Nickname',
        role: 'Role',
      },
      logout: 'Logout',
    },
    home: {
      welcome: 'Welcome!',
      email: 'Email:',
      nickname: 'Nickname:',
      role: 'Role:',
      logout: 'Logout',
    },
    common: {
      error: 'Error',
    },
  },
};
