import React from 'react';

export const InfoWindowContent = event => {
  const description = document.createElement('div');
  const htmlTemplate = `
  <h1 class='event-host'>Chef: ${event.host}</h1>
  <h2 class='event-description'>${event.description}</h2>
  <h3 class='event-time'>${event.time}</h3>
  <h4 class='event-capacity'>Willing to host up to <strong>${
    event.capacity
  }</strong> tastees</h4>
  `;
  description.innerHTML = htmlTemplate;
  return description;
};
