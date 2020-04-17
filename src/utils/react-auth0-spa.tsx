import React, { useState, useEffect, useContext, FC } from "react";
import createAuth0Client from "@auth0/auth0-spa-js";

interface Auth0ProviderProps {
  children: React.Node;
  auth0Options: Auth0ClientOptions;
  onRedirectCallback: Function;
}

export interface Auth0ContextType {
  isAuthenticated: boolean;
  user?: any;
  loading: boolean;
  popupOpen: boolean;
  loginWithPopup: Function;
  handleRedirectCallback: Function;
  getIdTokenClaims: Function;
  loginWithRedirect: Function,
    getTokenSilently: Function,
    getTokenWithPopup: Function,
    logout: Function;
}

const defaultAuth0Context: Auth0ContextType = {
  isAuthenticated: false,
  loading: false,
  popupOpen: false,
  loginWithPopup: () => { },
  handleRedirectCallback: () => { },
  getIdTokenClaims: () => { },
  loginWithRedirect: () => { },
  getTokenSilently: () => { },
  getTokenWithPopup: () => { },
  logout: () => { }
};

const DEFAULT_REDIRECT_CALLBACK = () =>
  window.history.replaceState({}, document.title, window.location.pathname);

export const Auth0Context = React.createContext(defaultAuth0Context);
export const useAuth0 = () => useContext(Auth0Context);
export const Auth0Provider: FC<Auth0ProviderProps> = ({
                                                        children,
                                                        onRedirectCallback = DEFAULT_REDIRECT_CALLBACK,
                                                        ...auth0Options
                                                      }: Auth0ProviderProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState();
  const [user, setUser] = useState();
  const [auth0Client, setAuth0] = useState();
  const [loading, setLoading] = useState(true);
  const [popupOpen, setPopupOpen] = useState(false);

  useEffect(() => {
    const initAuth0 = async () => {
      const auth0FromHook = await createAuth0Client(auth0Options);
      setAuth0(auth0FromHook);

      if (window.location.search.includes("code=") &&
        window.location.search.includes("state=")) {
        const { appState } = await auth0FromHook.handleRedirectCallback();
        (onRedirectCallback as any)(appState);
      }

      const isAuthenticated = await auth0FromHook.isAuthenticated();

      setIsAuthenticated(isAuthenticated);

      if (isAuthenticated) {
        const user = await auth0FromHook.getUser();
        setUser(user);
      }

      setLoading(false);
    };
    initAuth0();
  }, []);

  const loginWithPopup = async (params = {}) => {
    setPopupOpen(true);
    try {
      await auth0Client.loginWithPopup(params);
    } catch (error) {
      console.error(error);
    } finally {
      setPopupOpen(false);
    }
    const user = await auth0Client.getUser();
    setUser(user);
    setIsAuthenticated(true);
  };

  const handleRedirectCallback = async () => {
    setLoading(true);
    await auth0Client.handleRedirectCallback();
    const user = await auth0Client.getUser();
    setLoading(false);
    setIsAuthenticated(true);
    setUser(user);
  };
  return (
    <Auth0Context.Provider
      value={{
        isAuthenticated,
        user,
        loading,
        popupOpen,
        loginWithPopup,
        handleRedirectCallback,
        getIdTokenClaims: (...p) => auth0Client.getIdTokenClaims(...p),
        loginWithRedirect: (...p) => auth0Client.loginWithRedirect(...p),
        getTokenSilently: (...p) => auth0Client.getTokenSilently(...p),
        getTokenWithPopup: (...p) => auth0Client.getTokenWithPopup(...p),
        logout: (...p) => auth0Client.logout(...p)
      }}
    >
      {children}
    </Auth0Context.Provider>
  );
};

