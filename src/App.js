import { useEffect, useMemo, useReducer, useState } from "react";
import { Link, Routes, Route } from "react-router-dom";
import { useParams } from "react-router-dom";
import { ACTION_TYPES } from "./actions/postActionTypes";
import { INITIAL_STATE, postReducer } from "./reducers/postReducer";

const Main = () => {
  return (
    <>
      <h4>useState</h4>
      <p>
        <Link to="/ex1">Ex1</Link>
      </p>
      <h4>AbortController</h4>
      <p>
        <Link to="/ex2/1">Ex2</Link>
      </p>
      <h4>useState (Object)</h4>
      <p>
        <Link to="/ex3">Ex3</Link>
      </p>
      <h4>useReducer</h4>
      <p>
        <Link to="/ex4">Ex4</Link>
      </p>
      <h4>useMemo</h4>
      <p>
        <Link to="/ex5">Ex5</Link>
      </p>
    </>
  );
};
const Ex1 = () => {
  const [number, setNumber] = useState(0);

  const increase = () => {
    setNumber(number + 1);
  };

  const increaseAsync = () => {
    setTimeout(() => {
      setNumber((current) => current + 1);
    }, 2000);
  };
  return (
    <div>
      <h1>{number}</h1>
      <button onClick={increase}>Increase</button>
      <button onClick={increaseAsync}>Increase Async</button>
    </div>
  );
};

const Ex2 = () => {
  const [user, setUser] = useState([]);
  const params = useParams();
  const id = params.userId;
  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    fetch(`https://jsonplaceholder.typicode.com/users/${id}`, { signal })
      .then((res) => res.json())
      .then((data) => {
        setUser(data);
        alert("fetch data");
      })
      .catch((err) => {
        if ((err.name = "AbortError")) {
          alert("fetch cancelled");
        }
      });

    return () => {
      controller.abort();
    };
  }, [id]);
  return (
    <>
      <p>{user.id}</p>
      <p>{user.name}</p>
      <p>{user.website}</p>
    </>
  );
};

const Ex3 = () => {
  const [input, setInput] = useState("");
  const [user, setUser] = useState({
    name: "John",
    email: "john@gmail.com",
    images: ["profile.png", "cover.png"],
  });

  const changeUser = () => {
    setUser((prev) => ({ ...prev, name: input }));
  };
  return (
    <>
      <div>
        <h2>User:</h2>
        <input
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter a new name..."
        />
        <button onClick={changeUser}>Change username</button>
        <p>Username is: {user.name}</p>
        <p>Profile picture is: {user.images[1]}</p>
      </div>
    </>
  );
};

const Ex4 = () => {
  const [state, dispatch] = useReducer(postReducer, INITIAL_STATE);
  const handleFetch = () => {
    dispatch({ type: ACTION_TYPES.FETCH_START });
    fetch("https://jsonplaceholder.typicode.com/posts/1")
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        dispatch({ type: ACTION_TYPES.FETCH_SUCCESS, payload: data });
      })
      .catch((err) => {
        dispatch({ type: ACTION_TYPES.FETCH_ERROR });
      });
  };
  return (
    <>
      <button onClick={handleFetch}>
        {state.loading ? "Wait..." : "Fetch the post"}
      </button>
      <p>{state.post?.title}</p>
      <p>{state.error && "Something went wrong!"}</p>
    </>
  );
};

const Ex5 = () => {
  const [text, setText] = useState("");
  const [number, setNumber] = useState("");

  const expensiveFunction = (n) => {
    let total = 0;
    for (let i = 1; i < n; i++) {
      total += 1;
    }
    return total;
  };

  const sum = useMemo(() => expensiveFunction(number), [number]);
  console.log("Component re-rendered");
  return (
    <>
      <p>
        text:
        {text}
      </p>
      <p>
        <input
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter a text"
        />
      </p>
      <input
        onChange={(e) => setNumber(e.target.value)}
        placeholder="Enter a number"
        type="number"
      />
      <p>Total: {sum}</p>
    </>
  );
};

function App() {
  return (
    <Routes>
      <Route path="/ex1" element={<Ex1 />} />
      <Route path="/ex2/:userId" element={<Ex2 />} />
      <Route path="/ex3" element={<Ex3 />} />
      <Route path="/ex4" element={<Ex4 />} />
      <Route path="/ex5" element={<Ex5 />} />
      <Route path="/" element={<Main />} />
    </Routes>
  );
}

export default App;
