import React, { useState, useEffect, useCallback } from 'react';
import { Tooltip } from 'react-tooltip';
import { Event, Subject } from './types';

import './react-life-timeline.css';
import { Skull } from 'lucide-react';

interface LifeTimelineProps {
  subject: Subject;
  events: Event[];
  birthdayColor?: string;
  futureDays?: number;
  today?: Date;
  famousDeaths?: { name: string; daysLived: number }[];
}

interface Week {
  start: Date;
  end: Date;
  events: Event[];
  color: string | null;
  single?: boolean;
  hasDeath?: boolean;
}

const getEnd = (lastEventDate: Date, futureDays: number): Date => {
  const projectedEnd = new Date(lastEventDate.getTime());
  projectedEnd.setDate(projectedEnd.getDate() + futureDays);
  return projectedEnd;
};

const getEventEndDate = (e: Event): Date => {
  if (e.endDate) return new Date(e.endDate);
  else return new Date(e.startDate);
};

const findLastEventDate = (events: Event[]): Date => {
  let lastEventDate = new Date();
  if (events && events.length > 0) {
    const latestEvent = events[events.length - 1];
    const latestEnd = getEventEndDate(latestEvent);
    if (latestEnd > lastEventDate) {
      lastEventDate = latestEnd;
    }
  }
  return lastEventDate;
};

const DAYS_IN_A_YEAR = 365
const AVERAGE_LIFE_SPAN = 79 // years

const LifeTimeline: React.FC<LifeTimelineProps> = ({ subject, events = [], birthdayColor = '#F89542', today = new Date(), futureDays, famousDeaths = [] }) => {
  const [loaded, setLoaded] = useState(false);
  const [weeks, setWeeks] = useState<Week[]>([]);

  const generateWeeks = useCallback(() => {
    if (!subject || !subject.birthdate) return [];

    const birth = new Date(subject.birthdate);
    const lastEventDate = findLastEventDate(events);
    if (futureDays === undefined) {
      const averageHumanLifeSpanDays = AVERAGE_LIFE_SPAN * DAYS_IN_A_YEAR;
      const lifeExpectancyDays = subject.lifeExpectancy ? subject.lifeExpectancy * DAYS_IN_A_YEAR : averageHumanLifeSpanDays;
      futureDays = lifeExpectancyDays - (lastEventDate.getFullYear() - birth.getFullYear()) * DAYS_IN_A_YEAR;
    }
    const end = getEnd(lastEventDate, futureDays);

    let weeks: Week[] = [];
    let currentDate = new Date(birth.getTime());

    while (currentDate <= end) {
      const weekEnd = new Date(currentDate.getTime());
      weekEnd.setDate(weekEnd.getDate() + 6);

      const weekEvents = events.filter(e => {
        const eventStart = new Date(e.startDate);
        const eventEnd = e.endDate ? new Date(e.endDate) : today;
        return (eventStart <= weekEnd && eventEnd >= currentDate) || (e.ongoing && eventStart <= weekEnd);
      });

      // Add famous deaths to the week events
      const weekFamousDeaths = famousDeaths.filter(death => {
        const birthDate = new Date(subject.birthdate);
        const deathDate = new Date(birthDate.getTime() + (death.daysLived * 24 * 60 * 60 * 1000));
        return deathDate >= currentDate && deathDate <= weekEnd;
      });
      console.log(weekFamousDeaths)

      let hasDeath = false
      weekFamousDeaths.forEach(death => {
        const birthDate = new Date(subject.birthdate);
        const deathDate = new Date(birthDate.getTime() + (death.daysLived * 24 * 60 * 60 * 1000)).toISOString();
        hasDeath = true
        weekEvents.push({
          name: `${death.name} died at ${Math.floor(death.daysLived / 365)} years old`,
          startDate: deathDate,
          endDate: deathDate,
          keywords: ['death'],
        });
      });

      const isBirthday = birth.getMonth() === currentDate.getMonth() && birth.getDate() >= currentDate.getDate() && birth.getDate() <= weekEnd.getDate();
      const age = currentDate.getFullYear() - birth.getFullYear()
      if (isBirthday && age) {
        weekEvents.unshift({
          name: `${subject.name} turns ${age}`,
          startDate: currentDate.toISOString(),
          endDate: currentDate.toISOString(),
          color: birthdayColor,
          keywords: ['birthday'],
        });
      }

      weeks.push({
        start: new Date(currentDate.getTime()),
        end: weekEnd,
        events: weekEvents,
        color: isBirthday ? birthdayColor : null,
        hasDeath
      });

      currentDate.setDate(currentDate.getDate() + 7);
    }

    return weeks;
  }, [subject, events, birthdayColor, futureDays, famousDeaths]);

  useEffect(() => {
    setWeeks(generateWeeks());
    setLoaded(true);
  }, [generateWeeks]);

  const renderWeek = useCallback((week: Week, index: number) => {
    const future = week.end > today;
    const current = week.start <= today && today <= week.end;

    let color = week.color;
    if (!color && week.events.length > 0) {
      color = week.events[0].color || '#4287f5';
    }

    const weekNumber = index ? 'Week ' + index + ', ' : ''
    const monthYear = week.start.toLocaleString('default', { month: 'long', year: 'numeric' })
    const tip = weekNumber + monthYear + '<br/>' + week.events.map(e => e.name).join('<br/>');
    const url = week.events.length === 1 ? week.events[0].url : null;

    const weekStyle: React.CSSProperties = {
      backgroundColor: color || undefined,
      opacity: future ? 0.5 : 0.7,
      cursor: url ? 'pointer' : 'default',
      position: 'relative'
    };

    // if (week.single) weekStyle.borderRadius = '50%';
    if (current) { 
      weekStyle.border = '1px solid white'
    } else {
      weekStyle.border = '1px solid transparent'
    };

    const clickHandler = url ? () => window.open(url, '_blank') : undefined;

    return (
      <div
        key={'week-' + index}
        className="week"
        title={week.start.toLocaleDateString()}
        style={weekStyle}
        data-tip={tip}
        data-tooltip-id="week-tooltip"
        data-tooltip-html={tip}
        data-tooltip-place="top"
        onClick={clickHandler}
      >
        {week.hasDeath && <Skull style={{ width: 16, height: 14, marginLeft: -8, position: 'absolute' }} />}
      </div>
    );
  }, [today]);

  return (
    <div>
      <div className='LifeTimeline'>
        {weeks.map(renderWeek)}
      </div>
      {loaded && <Tooltip place='top' id='week-tooltip' />}
    </div>
  );
};

export default LifeTimeline;
