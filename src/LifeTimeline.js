import React, { useState, useEffect, useCallback } from 'react'
import ReactTooltip from 'react-tooltip'

import './react-life-timeline.css'

const formatDate = (date) => {
  let day = date.getDate()
  let month = date.getMonth() + 1
  if (day < 10) {
    day = '0' + day
  }
  if (month < 10) {
    month = '0' + month
  }
  return date.getFullYear() + '-' + month + '-' + day
}

const isSingleEvent = (e) => {
  return (e.single || !e.date_end || e.date_start === e.date_end) && (!e.ongoing)
}

const getEnd = (lastEventDate, futureDays) => {
  const projectedEnd = new Date(lastEventDate.getTime())
  projectedEnd.setDate(projectedEnd.getDate() + futureDays)
  return projectedEnd
}

const getEventEndDate = (e) => {
  if (e.date_end) return new Date(e.date_end)
  else return new Date(e.date_start)
}

const findLastEventDate = (events) => {
  let lastEventDate = new Date()
  if (events && events.length > 0) {
    const latestEvent = [0]
    const latestEnd = getEventEndDate(latestEvent)
    if (latestEnd > lastEventDate) {
      lastEventDate = latestEnd
    }
  }
}

const getEventsInWeek = ({
  events = [],
  start,
  end,
  today,
  name,
  birthday,
  birthdayColor
}) => {
  const thisWeek = today >= start && today <= end
  let color = null
  let single = false // Has single events
  const weekEvents = events.filter((e) => {
    const eventStart = new Date(e.date_start)
    let eventEnd = new Date(e.date_end)
    if (e.ongoing) eventEnd = new Date()
    const startInWeek = eventStart >= start && eventStart < end
    const endInWeek = eventEnd >= start && eventEnd < end
    const eventSpansWeek = eventStart <= start && eventEnd >= end
    const eventIsInWeek = startInWeek || endInWeek || eventSpansWeek
    if (eventIsInWeek) {
      if (e.color) color = e.color
      if (isSingleEvent(e)) single = true
    }
    return eventIsInWeek
  })
  if (birthday) {
    let age = 0
    let birthdayInWeek = false
    while (start < end) {
      if (start.getMonth() === birthday.getMonth() && start.getDate() === birthday.getDate()) {
        birthdayInWeek = true
        age = start.getFullYear() - birthday.getFullYear()
        break
      }
      start.setDate(start.getDate() + 1)
    }
    if (birthdayInWeek) {
      color = birthdayColor
      const me = name === null
      let title
      const subj = me ? 'I' : name
      if (age === 0) {
        const verb = me ? 'am' : 'is'
        title = `${subj} ${verb} born!`
      } else {
        const verb = me ? 'turn' : 'turns'
        title = `${subj} ${verb} ${age} on ${birthday.getMonth() + 1}/${birthday.getDate()}`
      }
      weekEvents.push({ title, color })
    }
  }
  if (thisWeek) {
    color = 'white'
    weekEvents.push({ title: 'This week', color })
  }
  return {
    events: weekEvents,
    color,
    single
  }
}

function parseIsoDatetime(dateString = '') {
    if (!dateString) {
      return
    }
    var dt = dateString.split(/[: T-]/).map(parseFloat)
    return new Date(dt[0], dt[1] - 1, dt[2], dt[3] || 0, dt[4] || 0, dt[5] || 0, 0)
}

const LifeTimeline = ({ subject, events = [], birthdayColor = '#F89542', futureDays = 200, today = new Date(), ...props}) => {
  const [loaded, setLoaded] = useState(false)
  const [weeks, setWeeks] = useState([])

  const createWeeks = useCallback((events, lastEventDate = new Date()) => {
    let birthday = new Date()
    if (subject.birthdate) {
      birthday = parseIsoDatetime(subject.birthdate)
    }
    const end = getEnd(lastEventDate, futureDays)
    const cursor = new Date(birthday.getTime())
    const newWeeks = []
    while (cursor <= end) {
      const start = new Date(cursor.getTime())
      cursor.setDate(cursor.getDate() + 7)
      const end = new Date(cursor.getTime())
      const weekEvents = getEventsInWeek({
        events,
        start,
        end,
        today,
        birthday,
        birthdayColor,
        name: subject.name
      })
      newWeeks.push({ start, end, ...weekEvents })
    }
    setWeeks(newWeeks)
  }, [events, subject])

  useEffect(() => {
    if (events && events.length && subject && subject.birthdate) {
      const lastEvent = findLastEventDate(events)
      createWeeks(events, lastEvent)
    }
  }, [events, subject])

  useEffect(() => {
    ReactTooltip.rebuild()
    if (!loaded) {
      setLoaded(true)
    }
  }, [weeks])

  const renderWeek = ({ start, events, color, single = false }) => {
    const date = formatDate(start)
    let _single
    const isFutureDate = start > today
    const style = {}
    if (events.length > 0) style.backgroundColor = color || '#1AA9FF'
    let link
    const tips = [date].concat(events.map((e) => {
      if (e.url) link = e.url
      return e.title
    }))
    let cls = 'week'
    if (isFutureDate) cls += ' future'
    if (single) _single = <span className='singleEvents'></span>
    if (link) {
      return <a className={cls} key={date} style={style} data-tip={tips.join(', ')} href={link} target='_blank' rel="noopener noreferrer">{_single}</a>
    }
    return <div className={cls} key={date} style={style} data-tip={tips.join(', ')}>{_single}</div>
  }

  return (
    <div>
      {loaded && <ReactTooltip place='top' effect='solid' />}
      <div className='LifeTimeline'>
        {weeks.map(renderWeek)}
      </div>
    </div>
  )
}

export default LifeTimeline
