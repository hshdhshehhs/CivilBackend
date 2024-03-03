### Civil Proxy

**FAQ**

*It stops showing search suggestions after roughly 30 minutes.*

What I learned from this and advise to do is to go to https://cors-anywhere.herokuapp.com/corsdemo, and then follow the instructions there. Why? Take a peek at this code:

```javascript
fetch(`https://cors-anywhere.herokuapp.com/https://clients1.google.com/complete/search?hl=en&output=toolbar&q=${encodeURIComponent(
    e
)}`, {
    mode: "cors",
    method: "GET",
})
```

As you probably can see, the search feature is powered by https://cors-anywhere.herokuapp.com. So for security reasons, https://cors-anywhere.herokuapp.com will make any requests to its IP address throw a 403 status code in any responses after roughly 30 minutes, until you allow https://cors-anywhere.herokuapp.com to send responses back to your IP address once again.