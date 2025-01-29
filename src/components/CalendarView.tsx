import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import { parse, startOfWeek, getDay, format } from 'date-fns';
import { enUS } from 'date-fns/locale';
import 'react-big-calendar/lib/css/react-big-calendar.css';

// Definindo os Types de Training
type Training = {
  id: string;
  title: string;
  startDate: string; // ex. '2025-02-20T17:00:00.000Z'
  endDate: string;
};

const locales = {
  'en-US': enUS,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

type Props = {
  trainings: Training[];
  onSelectEvent?: (trainingId: string) => void;
};

export default function CalendarView({ trainings, onSelectEvent }: Props) {
  // Converter p/ events do big-calendar
  const events = trainings.map((tr) => ({
    id: tr.id,
    title: tr.title,
    start: new Date(tr.startDate),
    end: new Date(tr.endDate),
  }));

  function handleSelectEvent(event: any) {
    if (onSelectEvent) {
      onSelectEvent(event.id);
    }
  }

  return (
    <div style={{ height: 600 }}>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        onSelectEvent={handleSelectEvent}
        style={{ height: '100%' }}
      />
    </div>
  );
}
