export function parseTemplate(
  value: string,
  obj: any
) {

  if (!value.includes('{{')) {
    return obj[value]
  } else {

    const lookUp = new RegExp(`{{(.*?)}}`);

    while (lookUp.test(value)) {
      value = value.replace(
        lookUp,
        (RegExp.$1)
          .split('.')
          .reduce((acc, cur) =>
            acc[cur],
            obj
          )
      );
    }

    return value;
  }
}
