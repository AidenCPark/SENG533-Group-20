import http from 'k6/http';
import { sleep, check } from 'k6';

export let options = {
  stages: [
    { duration: '2m', target: 20 }, // Ramp up to 20 users
    { duration: '2m', target: 40 }, // Ramp up to 40 users
    { duration: '2m', target: 60 }, // Ramp up to 60 users
    { duration: '2m', target: 80 }, // Ramp up to 80 users
    { duration: '2m', target: 100 }, // Ramp up to 100 users
    { duration: '2m', target: 120 }, // Ramp up to 120 users
    { duration: '2m', target: 140 }, // Ramp up to 140 users
    { duration: '2m', target: 160 }, // Ramp up to 160 users
    { duration: '2m', target: 180 }, // Ramp up to 180 users
    { duration: '2m', target: 200 }, // Ramp up to 200 users

    // Eventually, the system will fail to handle the load, identifying the breaking point
  ],
};

const BASE_URL = 'http://localhost:8080/tools.descartes.teastore.webui';

export default function () {
  let response;

  // Navigating to the about page
  response = http.get(`${BASE_URL}/about`);
  check(response, { 'About page status was 200': (r) => r.status === 200 });
  sleep(1);

  // Browsing product categories
  response = http.get(`${BASE_URL}/category?id=1`); // assuming category '1' exists
  check(response, { 'Category page status was 200': (r) => r.status === 200 });
  sleep(1);

  // Adding an item to the cart
  response = http.get(`${BASE_URL}/cartAction?addToCart=1&productid=1`); // assuming product '1' exists
  check(response, { 'Add to cart action status was 200': (r) => r.status === 200 });
  sleep(1);

  // Viewing the cart
  response = http.get(`${BASE_URL}/cart`);
  check(response, { 'Cart page status was 200': (r) => r.status === 200 });
  sleep(1);

  // Removing an item from the cart
  response = http.get(`${BASE_URL}/cartAction?removeProduct=1&productid=1`); // assuming product '1' exists
  check(response, { 'Remove from cart action status was 200': (r) => r.status === 200 });
  sleep(1);

  // Checking out
  // Note: Checking out might require POST request with proper payload. This example uses GET for simplicity.
  response = http.get(`${BASE_URL}/cartAction?confirm=true`); // this will depend on how your checkout process is implemented
  check(response, { 'Checkout action status was 200': (r) => r.status === 200 });
  sleep(1);

  // Additional user actions here...

  // User logout (if previously logged in)
  response = http.get(`${BASE_URL}/logout`);
  check(response, { 'Logout status was 200': (r) => r.status === 200 });
  sleep(1);
}