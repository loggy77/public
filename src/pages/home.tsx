import React, { useEffect, useState } from "react";
import Logo from "../images/logo.webp";
import Swal from "sweetalert2";
import axios from "axios";

type LoginFormResult = {
  username: string;
  password: string;
};

type CreationsType = {
  nom: string;
  plans: string;
  description: string;
};

type LoginType = {
  username: string;
  password: string;
} | null;

export default function Home() {
  const [isLogged, setIsLogged] = useState<boolean>(false);
  const [creations, setCreations] = useState<CreationsType[]>([]);
  const [loginData, setLoginData] = useState<LoginType>(null);

  useEffect(() => {
    const session = localStorage.getItem("session");
    if (session) {
      setIsLogged(true);
    }
  }, []);

  useEffect(() => {
    axios.get("/creations").then((res) => {
      const data = res.data;
      setCreations(data);
    });
  }, []);

  useEffect(() => {
    if (!loginData) {
      return;
    }
    axios
      .post("/login", {
        username: loginData.username,
        password: loginData.password,
      })
      .then((res) => {
        const data = res.data;
        localStorage.setItem("session", data);
        setIsLogged(true);
      })
      .catch((err) => {
        Swal.fire("Les identifiant de connexion sont incorrect");
        console.log(err);
      })
      .finally(() => setLoginData(null));
  }, [loginData]);

  let usernameInput: HTMLInputElement;
  let passwordInput: HTMLInputElement;

  const loginModal = () => {
    Swal.fire<LoginFormResult>({
      title: "Connexion",
      html: `
          <input type="text" id="pseudo" class="swal2-input" placeholder="Pseudo" autocomplete="off">
          <input type="password" id="password" class="swal2-input" placeholder="Mot de Passe">
        `,
      confirmButtonText: "Connexion",
      focusConfirm: false,
      didOpen: () => {
        const popup = Swal.getPopup()!;
        usernameInput = popup.querySelector("#pseudo") as HTMLInputElement;
        passwordInput = popup.querySelector("#password") as HTMLInputElement;
        usernameInput.onkeyup = (event) =>
          event.key === "Enter" && Swal.clickConfirm();
        passwordInput.onkeyup = (event) =>
          event.key === "Enter" && Swal.clickConfirm();
      },
      preConfirm: () => {
        const username = usernameInput.value;
        const password = passwordInput.value;
        if (!username || !password) {
          return Swal.showValidationMessage(
            `Veuillez remplir tous les champs s'il vous plait`
          );
        }
        setLoginData({ username, password });
      },
    });
  };
  return (
    <>
      <header>
        <img src={Logo} alt="logo" />
        {isLogged ? (
          <a href="/dashboard">Dashboard</a>
        ) : (
          <a onClick={loginModal}>Connexion</a>
        )}
      </header>
      <main>
        <section className="home-presentation">
          <h1>Bienvenue sur le site de LoganCrafts</h1>
        </section>
        <section className="home-creations">
          <h2>Les dernières créations de LoganCrafts</h2>
          <div className="creations-wrapper">
            {creations &&
              creations.map((data, index) => (
                <article key={index}>
                  <img src={data.plans} alt="meuble" width={200} height={200} />
                  <p>{data.nom}</p>
                  <p>{data.description}</p>
                </article>
              ))}
          </div>
        </section>
      </main>
    </>
  );
}
