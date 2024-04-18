import http from 'k6/http';
import { sleep, check } from 'k6';

export let options = {
  stages: [
    { duration: '1m', target: 10 },  // Below normal load
    { duration: '1m', target: 20 },
    { duration: '1m', target: 40 },  // Normal load
    { duration: '1m', target: 60 },
    { duration: '1m', target: 80 },  // Around the breaking point
    { duration: '1m', target: 100 },
    { duration: '1m', target: 0 },   // Recovery stage
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