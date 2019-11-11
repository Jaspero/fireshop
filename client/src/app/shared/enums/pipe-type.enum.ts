export enum PipeType {
  Number = 'number',
  Currency = 'currency',
  Date = 'date',
  Math = 'math',
  Percent = 'percent',
  Json = 'json',
  Lowercase = 'lowercase',
  Titlecase = 'titlecase',
  Uppercase = 'uppercase',
  Sanitize = 'jpSanitize',

  /**
   * So users don't have to type jpSanitize
   */
  SanitizeFb = 'sanitize',
  Custom = 'custom'
}
