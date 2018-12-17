import React from 'react';

export const InfoWindowContent = (event, toggle, subscribe) => {
  const description = document.createElement('div');
  let button;
  const name = event.firstname + ' ' + event.lastname;
  const htmlTemplate = `
  <h1 class='event-host'>Chef: ${name}</h1>
  <h2 class='event-title'>Title: ${event.title}</h2
  <h3 class='event-description'>Description: ${event.description}</h3>
  <h4 class='event-time'>Time:${event.time}</h4>
  <h5 class='event-capacity'>Willing to host up to <strong>${
    event.capacity
  }</strong> tastees</h5>
  <h5 class='event-contact'>Contact: ${event.email} </h5>
  `;

  description.innerHTML = htmlTemplate;
  if (toggle === 'tastee') {
    button = document.createElement('button');
    button.classList.add('btn');
    button.innerHTML = 'Request To Join';
    button.addEventListener('click', () => {
      subscribe();
    });
    description.appendChild(button);
  }
  return description;
};
