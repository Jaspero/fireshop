export function firstOfMonth() {
  const dateNow = new Date();
  const monthStart = new Date(dateNow.getFullYear(), dateNow.getMonth());

  return monthStart.getTime();
}
