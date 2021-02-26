# Technical Questions

1. What would you add to your solution if you had more time?
   answer:

   1. finish global error handling for webworker.
   2. add more features to table component to support different type of data cell.
   3. organize the code to have better structure and more clear responsibility for each method.
   4. make it the same as the example.

2. What would you have done differently if you knew this page was going to get thousands of views
   per second vs per week?
   answer:
   from UI:

   1. lazy-loading everything if it is doable
   2. split code base better to support lazy-loading to only load the code when the page needs.
   3. Create smooth animations
   4. Minimize third-party impact
      from Backend:
   5. add load balance
   6. add caching

3. What was the most useful feature that was added to the latest version of your chosen language? Please include a snippet of code that shows how you've used it.
   answer:

   1. Optional Chaining.
      > if(this.foo?.bar)

4. How would you track down a performance issue in production? Have you ever had to do this?
   answer:

   1. add logging.
   2. use browser devTool
      I didn't do this before since my previous projects had dedicated DevOps to track it.

5. Can you describe common security concerns to consider for a frontend developer?
   answer:

   1. Injection flaws(SQL, XSS, etc).
   2. Authentication flow is broken.
   3. Cross Site Request Forgery.
   4. Missing function level access control.
   5. Sensitive data exposure.

6. How would you improve the Kraken API that you just used?
   answer:

   from a developer perspective. I prefer to have the data of the response to be more explicit.
   for example:

   > [number, number][] => {price: number, size: number}[]

   so when I start to use it, I can easily understand what the data is returned by the API.
