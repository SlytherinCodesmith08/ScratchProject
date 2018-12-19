import React from 'react';

export const InfoWindowContent = (event, toggle, subscribe, handleSeeReviews, handlePostReviews) => {
  const description = document.createElement('div');
  let button1, button2, button3;
  const name = event.lastname + ' ' + event.firstname;
  const htmlTemplate = `
  <h1 class='event-host'>Chef: <span id="chefName">${name}</span></h1>
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
    button1 = document.createElement('button');
    button1.classList.add('btn');
    button1.innerHTML = 'Request To Join';
    button1.addEventListener('click', () => {
      subscribe();
    });
    button2 = document.createElement('button');
    button2.classList.add('btn');
    button2.innerHTML = 'See this Chef\'s Reviews';
    button2.addEventListener('click', () => {
      handleSeeReviews();
    });
    button3 = document.createElement('button');
    button3.classList.add('btn');
    button3.innerHTML = 'Post a Review!';
    button3.addEventListener('click', () => {
      handlePostReviews();
    });
    description.appendChild(button1);
    description.appendChild(button2);
    description.appendChild(button3);
  }
  return description;
};
