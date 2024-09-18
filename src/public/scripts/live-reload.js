// NOTE: The server never fulfills this request, it stalls forever.
// Once the connection is closed, we try to connect with the server until we establish a successful
// connection. Then we reload the page.
await fetch("/templator/watch").then(async () => {
  window.location.reload();
});