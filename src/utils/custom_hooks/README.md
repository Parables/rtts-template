# Custom Hooks Documentation

This document contains short description with usage example of the various custom hooks sourced from [useHooks(🐠)](usehooks.com).

# [useAsync](https://usehooks.com/useAsync/)

It's generally a good practice to indicate to users the status of any async request. An example would be fetching data from an API and displaying a loading indicator before rendering the results. Another example would be a form where you want to disable the submit button when the submission is pending and then display either a success or error message when it completes.

Rather than litter your components with a bunch of useState calls to keep track of the state of an async function, you can use our custom hook which takes an async function as an input and returns the value, error, and status values we need to properly update our UI. Possible values for status prop are: "idle", "pending", "success", "error". As you'll see in the code below, our hook allows both immediate execution and delayed execution using the returned execute function.


```tsx
// Usage
function App() {
  const { execute, status, value, error } = useAsync<string>(myFunction, false);
  return (
    <div>
      {status === "idle" && <div>Start your journey by clicking a button</div>}
      {status === "success" && <div>{value}</div>}
      {status === "error" && <div>{error}</div>}
      <button onClick={execute} disabled={status === "pending"}>
        {status !== "pending" ? "Click me" : "Loading..."}
      </button>
    </div>
  );
}
// An async function for testing our hook.
// Will be successful 50% of the time.
const myFunction = (): Promise<string> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const rnd = Math.random() * 10;
      rnd <= 5
        ? resolve("Submitted successfully 🙌")
        : reject("Oh no there was an error 😞");
    }, 2000);
  });
};
```
📚Also check out:
[useSubmit]() - Original hook by Murat Catal that inspired this recipe

[SWR]() - A React Hooks library for remote data fetching. Similar concept, but includes caching, automatic refetching, and many other nifty features.

[react-async]() - React component and hook for declarative promise resolution and data fetching.



# [useDarkMode](https://usehooks.com/useDarkMode)
* Composes: useMedia[https://usehooks.com/useMedia], useLocalStorage[https://usehooks.com/useLocalStorage]
* This hook handles all the stateful logic required to add a ☾ dark mode toggle to your website. It utilizes localStorage to remember the user's chosen mode, defaults to their browser or OS level setting using the prefers-color-scheme media query and manages the setting of a .dark-mode className on body to apply your styles.
*
* This post also helps illustrate the power of hook composition. The syncing of state to localStorage is handled by our useLocalStorage hook. Detecting the user's dark mode preference is handled by our useMedia hook. Both of these hooks were created for other use-cases, but here we've composed them to create a super useful hook in relatively few lines of code. It's almost as if hooks bring the compositional power of React components to stateful logic! 🤯
*
* 📚Also check out:
donavon/use-dark-mode[https://github.com/donavon/use-dark-mode] - A more configurable implementation of this hook that syncs changes across browser tabs and handles SSR. Provided much of the code and inspiration for this post.

```tsx
// Usage
function App() {
  const [darkMode, setDarkMode] = useDarkMode();
  return (
    <div>
      <div className="navbar">
        <Toggle darkMode={darkMode} setDarkMode={setDarkMode} />
      </div>
      <Content />
    </div>
  );
} 
```


# [useDebounce](https://usehooks.com/useDebounce/)
This hook allows you to debounce any fast changing value. The debounced value will only reflect the latest value when the useDebounce hook has not been called for the specified time period. When used in conjunction with useEffect, as we do in the recipe below, you can easily ensure that expensive operations like API calls are not executed too frequently. The example below allows you to search the Marvel Comic API and uses useDebounce to prevent API calls from being fired on every keystroke. Be sure to check out the [CodeSandbox demo](https://codesandbox.io/s/711r1zmq50) for this one. Hook code and inspiration from github.com/xnimorz/use-debounce.
```tsx
 // Usage
function App() {
  // State and setters for ...
  // Search term
  const [searchTerm, setSearchTerm] = useState<string>("");
  // API search results
  const [results, setResults] = useState<any[]>([]);
  // Searching status (whether there is pending API request)
  const [isSearching, setIsSearching] = useState<boolean>(false);
  // Debounce search term so that it only gives us latest value ...
  // ... if searchTerm has not been updated within last 500ms.
  // The goal is to only have the API call fire when user stops typing ...
  // ... so that we aren't hitting our API rapidly.
  // We pass generic type, this case string
  const debouncedSearchTerm: string = useDebounce<string>(searchTerm, 500);
  // Effect for API call
  useEffect(
    () => {
      if (debouncedSearchTerm) {
        setIsSearching(true);
        searchCharacters(debouncedSearchTerm).then((results) => {
          setIsSearching(false);
          setResults(results);
        });
      } else {
        setResults([]);
      }
    },
    [debouncedSearchTerm] // Only call effect if debounced search term changes
  );
  return (
    <div>
      <input
        placeholder="Search Marvel Comics"
        onChange={(e: React.FormEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
      />
      {isSearching && <div>Searching ...</div>}
      {results.map((result) => (
        <div key={result.id}>
          <h4>{result.title}</h4>
          <img
            src={`${result.thumbnail.path}/portrait_incredible.${result.thumbnail.extension}`}
          />
        </div>
      ))}
    </div>
  );
}
// API search function
function searchCharacters(search: string): Promise<any[]> {
  const apiKey: string = "f9dfb1e8d466d36c27850bedd2047687";
  return fetch(
    `https://gateway.marvel.com/v1/public/comics?apikey=${apiKey}&titleStartsWith=${search}`,
    {
      method: "GET",
    }
  )
    .then((r) => r.json())
    .then((r) => r.data.results)
    .catch((error) => {
      console.error(error);
      return [];
    });
}
```


# [useLocalStorage](https://usehooks.com/useLocalStorage)
Sync state to local storage so that it persists through a page refresh. Usage is similar to useState except we pass in a local storage key so that we can default to that value on page load instead of the specified initial value.


📚Also check out:
[use-persisted-state](https://github.com/donavon/use-persisted-state) - A more advanced implementation that syncs between tabs and browser windows.
```tsx
import { useState } from "react";
// Usage
function App() {
  // Similar to useState but first arg is key to the value in local storage.
  const [name, setName] = useLocalStorage("name", "Bob");
  return (
    <div>
      <input
        type="text"
        placeholder="Enter your name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
    </div>
  );
}
// Hook
function useLocalStorage(key, initialValue) {
  // State to store our value
  // Pass initial state function to useState so logic is only executed once
  const [storedValue, setStoredValue] = useState(() => {
    try {
      // Get from local storage by key
      const item = window.localStorage.getItem(key);
      // Parse stored json or if none return initialValue
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      // If error also return initialValue
      console.log(error);
      return initialValue;
    }
  });
  // Return a wrapped version of useState's setter function that ...
  // ... persists the new value to localStorage.
  const setValue = (value) => {
    try {
      // Allow value to be a function so we have same API as useState
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      // Save state
      setStoredValue(valueToStore);
      // Save to local storage
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      // A more advanced implementation would handle the error case
      console.log(error);
    }
  };
  return [storedValue, setValue];
}
```



### [useMedia](https://usehooks.com/useMedia/)

This hook makes it super easy to utilize media queries in your component logic.
In our example below we render a different number of columns depending on which media query matches the current screen width,
and then distribute images amongst the columns in a way that limits column height difference
(we don't want one column way longer than the rest).

You could create a hook that directly measures screen width instead of using media queries,
but this method is nice because it makes it easy to share media queries between JS and your stylesheet.
See it in action in the [CodeSandbox Demo](https://codesandbox.io/s/6jlmpjq9vw).

📚Also check out:
[useMedia v1](https://gist.github.com/gragland/ed8cac563f5df71d78f4a1fefa8c5633/c769cdc6a658b3925e9e2e204d228400d132965f) - Original version of this recipe that uses a single event listener on browser resize. Works well, but only for screen width media queries.

[Masonry Grid](https://codesandbox.io/s/26mjowzpr?from-embed) - Original source of our useMedia v1 code. This demo uses react-spring to animate when images change columns.

```tsx
// Usage
function App() {
  const columnCount = useMedia<number>(
    // Media queries
    ['(min-width: 1500px)', '(min-width: 1000px)', '(min-width: 600px)'],
    // Column counts (relates to above media queries by array index)
    [5, 4, 3],
    // Default column count
    2,
  );
  // Create array of column heights (start at 0)
  let columnHeights = new Array(columnCount).fill(0);
  // Create array of arrays that will hold each column's items
  let columns = new Array(columnCount).fill().map(() => []) as Array<DataProps[]>;
  (data as DataProps[]).forEach((item) => {
    // Get index of shortest column
    const shortColumnIndex = columnHeights.indexOf(Math.min(...columnHeights));
    // Add item
    columns[shortColumnIndex].push(item);
    // Update height
    columnHeights[shortColumnIndex] += item.height;
  });
  // Render columns and items
  return (
    <div className="App">
      <div className="columns is-mobile">
        {columns.map((column) => (
          <div className="column">
            {column.map((item) => (
              <div
                className="image-container"
                  {/*Size image container to aspect ratio of image */}
                style={{
                  paddingTop: (item.height / item.width) * 100 + '%'
                }}>
                <img src={item.image} alt="" />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
```

# [useOnScreen](https://usehooks.com/useOnScreen)
This hook allows you to easily detect when an element is visible on the screen as well as specify how much of the element should be visible before being considered on screen. Perfect for lazy loading images or triggering animations when the user has scrolled down to a particular section.

📚Also check out:
[react-intersection-observer](https://github.com/thebuilder/react-intersection-observer) - A more robust and configurable implementation of this hook.

```tsx
// Usage
function App() {
  // Ref for the element that we want to detect whether on screen
  const ref: any = useRef<HTMLDivElement>();
  // Call the hook passing in ref and root margin
  // In this case it would only be considered onScreen if more ...
  // ... than 300px of element is visible.
  const onScreen: boolean = useOnScreen<HTMLDivElement>(ref, "-300px");
  return (
    <div>
      <div style={{ height: "100vh" }}>
        <h1>Scroll down to next section 👇</h1>
      </div>
      <div
        ref={ref}
        style={{
          height: "100vh",
          backgroundColor: onScreen ? "#23cebd" : "#efefef",
        }}
      >
        {onScreen ? (
          <div>
            <h1>Hey I'm on the screen</h1>
            <img src="https://i.giphy.com/media/ASd0Ukj0y3qMM/giphy.gif" />
          </div>
        ) : (
          <h1>Scroll down 300px from the top of this section 👇</h1>
        )}
      </div>
    </div>
  );
}
```

### [useToggle](https://usehooks.com/useToggle/)

Basically, what this hook does is that, it takes a parameter with value true or false and toggles that value to opposite. It's useful when we want to take some action into it's opposite action, for example: show and hide modal, show more/show less text, open/close side menu.

```tsx
// Usage
function App() {
    // Call the hook which returns, current value and the toggler function
    const [isTextChanged, setIsTextChanged] = useToggle();
    
    return (
        <button onClick={setIsTextChanged}>{isTextChanged ? 'Toggled' : 'Click to Toggle'}</button>
    );
}
```