export function safeEval(method: string) {
  let final: any;

  try {
    // tslint:disable-next-line:no-eval
    final = eval(method);
  } catch (e) {
    console.error('Failed to eval', e)
  }

  return final;
}
