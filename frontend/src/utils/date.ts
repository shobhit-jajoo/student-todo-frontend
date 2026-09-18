export function formatDate(date: string | null | undefined): string {
  if (!date) return 'No due date';

  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return 'No due date';

  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(parsed);
}

export function formatDateTime(date: string | null | undefined): string {
  if (!date) return 'N/A';

  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return 'N/A';

  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(parsed);
}

export function toInputDateFormat(date: string | null | undefined): string {
  if (!date) return '';
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return '';
  const year = parsed.getFullYear();
  const month = String(parsed.getMonth() + 1).padStart(2, '0');
  const day = String(parsed.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function isOverdue(date: string | null | undefined, completed: boolean): boolean {
  if (!date || completed) return false;
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = new Date(parsed);
  due.setHours(0, 0, 0, 0);
  return due.getTime() < today.getTime();
}

export function isDueToday(date: string | null | undefined): boolean {
  if (!date) return false;
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = new Date(parsed);
  due.setHours(0, 0, 0, 0);
  return due.getTime() === today.getTime();
}
