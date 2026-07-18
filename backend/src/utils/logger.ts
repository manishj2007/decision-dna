export class Logger {
  static info(message: string, data?: any) {
    console.log([INFO] , data ? JSON.stringify(data, null, 2) : '');
  }

  static error(message: string, error?: any) {
    console.error([ERROR] , error ? JSON.stringify(error, null, 2) : '');
  }

  static warn(message: string, data?: any) {
    console.warn([WARN] , data ? JSON.stringify(data, null, 2) : '');
  }

  static debug(message: string, data?: any) {
    if (process.env.NODE_ENV === 'development') {
      console.log([DEBUG] , data ? JSON.stringify(data, null, 2) : '');
    }
  }
}
