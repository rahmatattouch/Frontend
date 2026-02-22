import React from "react";
import Button from "./components/Button";
import Counter from "./components/Counter";
import Form from "./components/Form";


function App() {
 return (
   <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
     <h1 className="text-4xl font-bold text-blue-600 mb-4">
       Bienvenue sur React + Tailwind v3.4 !
     </h1>
     <p className="mb-4">Votre projet React est prêt !</p>
     <Button className="bg-red-500" text="Cliquer ici" onClick={() => alert("Bouton cliqué !")} />
     <Button className="bg-green-500" text="Bouton secondaire" onClick={() => alert("Bouton secondaire cliqué !")}  />
 <Counter />
 <Form />
   </div>
 );
}

export default App;
