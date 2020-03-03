export function setServerState(data: any, document: Document) {
  const script = document.createElement('script');
  script.type = 'text/javascript';
  script.text = `window.aServerState=${JSON.stringify(data)}`;

  // @ts-ignore
  document.querySelector('head').appendChild(script);
}
