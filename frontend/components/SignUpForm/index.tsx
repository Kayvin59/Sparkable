import { useState, FormEvent } from "react";
import styles from "./index.module.scss";
import Link from "next/link";
import { FormInput } from "../FormInput";
import classNames from "classnames";

export const SignUpForm = () => {
  const [ inputValues, setInputValues ] = useState({
    username: "",
    email: "",
    password: "",
  });

  const onInputChange = (event: FormEvent<HTMLInputElement>) => {
    const { name, value } = event.currentTarget;

    setInputValues(prevState => {
      return { ...prevState, [name]: value };
    });
  };

  const onInputClear = (name: string) => {
    setInputValues(prevState => {
      return { ...prevState, [name]: "" };
    });
  };

  return (
    <form className={styles.authForm}>
      <header className={styles.authHeader}>
        <h2 className={styles.authTitle}>Create Account</h2>
        <div className={styles.authNavWrapper}>
          <span className="">or</span>
          <Link className={styles.authButtonLink} href="/auth/signin">Signin</Link>
        </div>
      </header>
      <div className={styles.authFields}>
        <FormInput
          value={inputValues.email}
          id="email"
          name="email"
          label="Email"
          placeholder="Your email address"
          onChange={onInputChange}
          onClear={onInputClear}
          // errorMessage="This email address is not valid. Please check for spelling errors and try again."
        />
        <FormInput
          value={inputValues.username}
          id="username"
          name="username"
          label="Username"
          placeholder="Choose a username"
          onChange={onInputChange}
          onClear={onInputClear}
        />
        <FormInput
          type="password"
          value={inputValues.password}
          name="password"
          id="password"
          label="Password"
          placeholder="Choose a secure password"
          onChange={onInputChange}
          onClear={onInputClear}
        />
      </div>
      <footer className={styles.authFooter}>
        <button
          disabled
          className={classNames(styles.submitButton, styles.sizeXl, styles.disable)}
        >
          Create account
        </button>
        <div className={styles.footerText}>
          Click “Create account” to agree to the <Link href="/" className={styles.authLink}>Terms of Use</Link> of
          Sparkable and acknowledge that the <Link href="/" className={styles.authLink}>Privacy Policy</Link> of
          Sparkable applies to you.
        </div>
      </footer>
    </form>
  );
};