import React from 'react';

export const InfoWindowContent = (name, event) => {
  const description = document.createElement('div');
  const htmlTemplate = `
  <h1 class='event-host'>Chef: ${name}</h1>
  <h2 class='event-title'>Title: ${event.title}</h2
  <h1 class='event-description'>Description: ${event.description}</h1>
  <h3 class='event-time'>Time:${event.time}</h3>
  <h4 class='event-capacity'>Willing to host up to <strong>${
    event.capacity
  }</strong> tastees</h4>
  `;
  description.innerHTML = htmlTemplate;
  return description;
};
