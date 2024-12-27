import React, { useState, useEffect } from "react";
// import reactLogo from "./assets/react.svg";
import { invoke } from "@tauri-apps/api/core";
import "./App.css";
import "./style.css";
import SignupForm from "./components/Form/SignupForm";
import CustomAlert from "./components/Alert/CustomAlert";

interface User {
  name: string;
  email: string;
  API: string;
}

interface Data {
  id: number;
  name: string;
  email: string;
  API: string;
}

const App: React.FunctionComponent = () => {
  const [user, setUser] = useState<User | null>(null);
  const [data, setData] = useState<Data[]>([]);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState(""); 


  useEffect(() => {
    const currentUser = localStorage.getItem("currentUser");
    if (currentUser) {
        setUser(JSON.parse(currentUser));
    }
  }, []);


  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response: Data[] = await invoke("get_data");
      setData(response);
    } catch(error: any){
      console.error(error);
      setAlertMessage(error.toString());
      setShowAlert(true);
    }
  }

  useEffect(() => {
    if (data.length === 0) {
      const mockData = [
        {id: 1, name: "Taro", email: "taro@taro", API: "https://api.github.com/users/tauri-apps"},
        {id: 2, name: "Jiro", email: "jiro@jiro", API: "https://api.github.com/users/tauri-apps"},
      ];
      setData(mockData);
    }
  }, []);

  const handleCloseAlert = () => {
    setShowAlert(false);
  }
  
  return (
    <main className="container">
      {showAlert && <CustomAlert message={alertMessage} onClose={handleCloseAlert} />}
      <h1>Welcome to Tauri + React + Sqlite</h1>

      {user && (
        <div>
          <h2>
            あなたの名前は{user.name}です。
          </h2>
        </div>
      )}

      <SignupForm setShowAlert={setShowAlert} setAlertMessage={setAlertMessage} />

      <table>
        <thead>
          <tr>
            <th>id</th>
            <th>name</th>
            <th>email</th>
            <th>API</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item)=> (
            <tr key={item.id}>
                <td>{item.id}</td>
                <td>{item.name}</td>
                <td>{item.email}</td>
                <td>{item.API}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}

// function App() {
//   const [greetMsg, setGreetMsg] = useState("");
//   const [name, setName] = useState("");

//   async function greet() {
//     // Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
//     setGreetMsg(await invoke("greet", { name }));
//   }

//   return (
//     <main className="container">
//       <h1>Welcome to Tauri + React + Sqlite</h1>

//       <div className="row">
//         <a href="https://vitejs.dev" target="_blank">
//           <img src="/vite.svg" className="logo vite" alt="Vite logo" />
//         </a>
//         <a href="https://tauri.app" target="_blank">
//           <img src="/tauri.svg" className="logo tauri" alt="Tauri logo" />
//         </a>
//         <a href="https://reactjs.org" target="_blank">
//           <img src={reactLogo} className="logo react" alt="React logo" />
//         </a>
//       </div>
//       <p>Click on the Tauri, Vite, and React logos to learn more.</p>

//       <form
//         className="row"
//         onSubmit={(e) => {
//           e.preventDefault();
//           greet();
//         }}
//       >
//         <input
//           id="greet-input"
//           onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.currentTarget.value)}
//           placeholder="Enter a name..."
//         />
//         <button type="submit">Greet</button>
//       </form>
//       <p>{greetMsg}</p>
//     </main>
//   );
// }

export default App;
