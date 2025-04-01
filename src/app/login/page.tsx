"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

enum MODE {
  LOGIN = "LOGIN",
  REGISTER = "REGISTER",
  RESET_PASSWORD = "RESET_PASSWORD",
  EMAIL_VERIFICATION = "EMAIL_VERIFICATION",
}

const LoginPage = () => {
  //   const wixClient = useWixClient();
  const router = useRouter();

  //   const isLoggedIn = wixClient.auth.loggedIn();

  //   if (isLoggedIn) {
  //     router.push("/");
  //   }

  const [mode, setMode] = useState(MODE.LOGIN);

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailCode, setEmailCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const formTitle =
    mode === MODE.LOGIN
      ? "Log in"
      : mode === MODE.REGISTER
      ? "Register"
      : mode === MODE.RESET_PASSWORD
      ? "Reset Your Password"
      : "Verify Your Email";

  const buttonTitle =
    mode === MODE.LOGIN
      ? "Login"
      : mode === MODE.REGISTER
      ? "Register"
      : mode === MODE.RESET_PASSWORD
      ? "Reset"
      : "Verify";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    //     try {
    //       let response;

    //       switch (mode) {
    //         case MODE.LOGIN:
    //           response = await wixClient.auth.login({
    //             email,
    //             password,
    //           });
    //           break;
    //         case MODE.REGISTER:
    //           response = await wixClient.auth.register({
    //             email,
    //             password,
    //             profile: { nickname: username },
    //           });
    //           break;
    //         case MODE.RESET_PASSWORD:
    //           response = await wixClient.auth.sendPasswordResetEmail(
    //             email,
    //             window.location.href
    //           );
    //           setMessage("Password reset email sent. Please check your e-mail.");
    //           break;
    //         case MODE.EMAIL_VERIFICATION:
    //           response = await wixClient.auth.processVerification({
    //             verificationCode: emailCode,
    //           });
    //           break;
    //         default:
    //           break;
    //       }

    //       switch (response?.loginState) {
    //         case LoginState.SUCCESS:
    //           setMessage("Successful! You are being redirected.");
    //           const tokens = await wixClient.auth.getMemberTokensForDirectLogin(
    //             response.data.sessionToken!
    //           );

    //           Cookies.set("refreshToken", JSON.stringify(tokens.refreshToken), {
    //             expires: 2,
    //           });
    //           wixClient.auth.setTokens(tokens);
    //           router.push("/");
    //           break;
    //         case LoginState.FAILURE:
    //           if (
    //             response.errorCode === "invalidEmail" ||
    //             response.errorCode === "invalidPassword"
    //           ) {
    //             setError("Invalid email or password!");
    //           } else if (response.errorCode === "emailAlreadyExists") {
    //             setError("Email already exists!");
    //           } else if (response.errorCode === "resetPassword") {
    //             setError("You need to reset your password!");
    //           } else {
    //             setError("Something went wrong!");
    //           }
    //         case LoginState.EMAIL_VERIFICATION_REQUIRED:
    //           setMode(MODE.EMAIL_VERIFICATION);
    //         case LoginState.OWNER_APPROVAL_REQUIRED:
    //           setMessage("Your account is pending approval");
    //         default:
    //           break;
    //       }
    //     } catch (err) {
    //       console.log(err);
    //       setError("Something went wrong!");
    //     } finally {
    //       setIsLoading(false);
    //     }
  };
  // const{UpdateUser} = LoginRepository();
  // const response = UpdateUser();
  // console.log(response);
  const [user, setUser] = useState("");
  useEffect(() => {
    fetch("/api/Auth/Login", {
      method: "POST", // ✅ Now POST should work
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include", // ✅ Ensures cookies (JWT) are sent
      body: JSON.stringify({ userName: "user1", password: "abc123" }),
    })
      .then((response) => response.json())
      .then((data) => setUser(data.message))
      .catch((error) => console.error("Fetch error:", error));

    
  }, []);

  const token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxIiwidW5pcXVlX25hbWUiOiJ1c2VyMSIsImp0aSI6ImEyYjU0NGY3LWM5ZTUtNDQ0Ni1hMDk0LTUwZjY3ZGQ5MTI2YSIsIm5iZiI6MTc0MzUwMTc4NSwiZXhwIjoxNzQzNTA1Mzg1LCJpYXQiOjE3NDM1MDE3ODUsImlzcyI6Imh0dHBzOi8vbG9jYWxob3N0OjUwMDEiLCJhdWQiOiJodHRwOi8vbG9jYWxob3N0OjMwMDAifQ.GAqdwv3Ts_jRVFWOnc1jJGteIuKfMpmw_kLoJ7cUo9k";
  console.log(user);
  console.log(`Bearer ${user?? token}`);

  fetch("/api/User/Update", {
    method: "PATCH",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${user?? token}`,
    },
    body: JSON.stringify({
      name: "user1",
      password: "abc123",
      phone: "0123456789",
      email: "user@gmail.com",
    }),
  })
    .then(async(response) => response.json())
    .then((data) => console.log("Response:", data))
    .catch((error) => console.error("Fetch error:", error));
  // useEffect(() => {
  //   fetch("/api/Auth/Login", {
  //     method: "POST",
  //     body: JSON.stringify([
  //       {
  //         name: "user1",
  //         password: "abc123",
  //       },
  //     ]),
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //   })
  //     .then((res) => (res.ok ? res.json() : Promise.reject("Unauthorized")))
  //     .then((data) => setEmail(data))
  //     .catch((error) => console.error(error));
  // }, []);
  // console.log(email);

  useEffect(() => {}, []);
  // console.log(user);

  return (
    <div className="h-[calc(100vh-80px)] px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-64 flex items-center justify-center">
      <p>{email}</p>
      <p>{user}</p>
      <form className="flex flex-col gap-8" onSubmit={handleSubmit}>
        <h1 className="text-2xl font-semibold">{formTitle}</h1>
        {mode === MODE.REGISTER ? (
          <div className="flex flex-col gap-2">
            <label className="text-sm text-gray-700">Username</label>
            <input
              type="text"
              name="username"
              placeholder="john"
              className="ring-2 ring-gray-300 rounded-md p-4"
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
        ) : null}
        {mode !== MODE.EMAIL_VERIFICATION ? (
          <div className="flex flex-col gap-2">
            <label className="text-sm text-gray-700">E-mail</label>
            <input
              type="email"
              name="email"
              placeholder="john@gmail.com"
              className="ring-2 ring-gray-300 rounded-md p-4"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            <label className="text-sm text-gray-700">Verification Code</label>
            <input
              type="text"
              name="emailCode"
              placeholder="Code"
              className="ring-2 ring-gray-300 rounded-md p-4"
              onChange={(e) => setEmailCode(e.target.value)}
            />
          </div>
        )}
        {mode === MODE.LOGIN || mode === MODE.REGISTER ? (
          <div className="flex flex-col gap-2">
            <label className="text-sm text-gray-700">Password</label>
            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              className="ring-2 ring-gray-300 rounded-md p-4"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        ) : null}
        {mode === MODE.LOGIN && (
          <div
            className="text-sm underline cursor-pointer"
            onClick={() => setMode(MODE.RESET_PASSWORD)}
          >
            Forgot Password?
          </div>
        )}
        <button
          className="bg-lama text-white p-2 rounded-md bg-pink-500 disabled:bg-pink-200 disabled:cursor-not-allowed"
          disabled={isLoading}
        >
          {isLoading ? "Loading..." : buttonTitle}
        </button>
        {error && <div className="text-red-600">{error}</div>}
        {mode === MODE.LOGIN && (
          <div
            className="text-sm underline cursor-pointer"
            onClick={() => setMode(MODE.REGISTER)}
          >
            {"Don't"} have an account?
          </div>
        )}
        {mode === MODE.REGISTER && (
          <div
            className="text-sm underline cursor-pointer"
            onClick={() => setMode(MODE.LOGIN)}
          >
            Have and account?
          </div>
        )}
        {mode === MODE.RESET_PASSWORD && (
          <div
            className="text-sm underline cursor-pointer"
            onClick={() => setMode(MODE.LOGIN)}
          >
            Go back to Login
          </div>
        )}
        {message && <div className="text-green-600 text-sm">{message}</div>}
      </form>
    </div>
  );
};

export default LoginPage;
