import "./App.css";
import { RouterProvider } from "react-router";
import { useAuth } from "react-oidc-context";
import { router } from "./routes";

function App() {
  const auth = useAuth();

  if (auth.isLoading) {
    return <div>Loading...</div>;
  }

  switch (auth.activeNavigator) {
    case "signinSilent":
      return <div>Signing you in...</div>;
    case "signinRedirect":
      return <div>Signing you in...</div>;
    case "signoutRedirect":
      return <div>Signing you out...</div>;
  }

  if (auth.error) {
    return <div>Oops... {auth.error.message}</div>;
  }
  if (!auth.isAuthenticated) {
    return (
      <button
        onClick={() =>
          void auth.signinRedirect({ redirect_uri: window.location.toString() })
        }
      >
        Log in
      </button>
    );
  } else {
    window.history.replaceState({}, document.title, window.location.pathname);
    return (
      <>
        <RouterProvider router={router(auth.user)} />
      </>
      // <Router>
      //   <Routes>
      //     <Route path="/tournaments/:id" element={<Interface />} />
      //     <Route path="/preview_certificates/:id" element={<Certificates />} />
      //     <Route path="/preview_slides/:id" element={<Slides />} />
      //     <Route path="/postings/:id" element={<Postings />} />
      //     <Route path="/mailing/:id" element={<Mailing />} />
      //     <Route path={"/stream"} element={<StreamingDashboard />} />
      //     <Route path="/" element={<Interface />} />
      //   </Routes>
      // </Router>
    );
  }
}

export interface TournamentIdProps {
  tournamentId: number;
}

export interface MedalCount {
  school: string;
  count: number;
}

export interface School {
  id: number;
  name: string;
  emails: SchoolEmail[];
}

export interface SchoolEmail {
  email: string;
  isPrimary: boolean;
}

export interface Result {
  school: School;
  points: number;
  id: number;
  place: number;
  placeString: string;
  name: string;
}

export default App;
