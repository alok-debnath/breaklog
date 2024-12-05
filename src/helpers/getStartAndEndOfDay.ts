import { DateTime } from 'luxon';

interface User {
  default_time_zone?: string | null;
}

function getStartAndEndOfDay(user: User | null): [Date, Date, string] {
  const timeZone = user?.default_time_zone || 'Etc/GMT';

  const startOfDay = DateTime.now().setZone(timeZone).startOf('day').toJSDate();

  const endOfDay = DateTime.now().setZone(timeZone).endOf('day').toJSDate();

  return [startOfDay, endOfDay, timeZone];
}

export default getStartAndEndOfDay;
