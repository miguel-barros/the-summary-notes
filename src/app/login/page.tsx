"use client";
import { loginRequest } from "@/requests/user";
import { setCookie } from "cookies-next";
import { useState } from "react";

type LoginInterface = Pick<UserInterface, "email"> & { password: string };

export default function Login() {
  const [form, setForm] = useState<LoginInterface>({
    email: "",
    password: "",
  });

  const handleLogin = async (form: LoginInterface) => {
    const { accessToken } = await loginRequest(form.email, form.password);
    if (accessToken) {
      setCookie("accessToken", accessToken, {
        maxAge: 30 * 24 * 60 * 60,
        path: "/",
      });
    }
  };

  return (
    <div>
      <form
        action="submit"
        onSubmit={(e) => {
          e.preventDefault();
          handleLogin(form);
        }}
      >
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />
        <input type="submit" value="Login" />
      </form>
    </div>
  );
}
